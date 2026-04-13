const { PrismaClient } = require('@prisma/client')
const { withAccelerate } = require('@prisma/extension-accelerate');

const prisma = new PrismaClient().$extends(withAccelerate())


const express = require("express");
const cors = require("cors");
const app = express();
const bcrypt = require("bcrypt");
const saltRounds = 10;
PORT = 4000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const bannedEmail = await prisma.bannedEmail.findFirst({
      where: { email: email },
    });

    if (bannedEmail) {
      return res.status(400).json("This email has been banned from the platform.");
    }

    const existingUser = await prisma.user.findFirst({
      where: { email: email },
    });

    if (existingUser) {
      return res.status(400).json("Username or Email already exists!");
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    const { password: _, ...safeUser } = user;
    
    res.status(201).json(safeUser);

  } catch (error) {
    console.error(error);
    res.status(500).json("An error occurred during registration.");
  }
});

app.get("/admin/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        profilePic: true,
      },
    });
    
    console.log("Users found:", users);
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json("An error occurred while fetching users.");
  }
});

app.delete("/admin/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      return res.status(404).json("User not found.");
    }

    await prisma.bannedEmail.create({
      data: {
        email: user.email,
      },
    });

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json("User banned successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).json("An error occurred while banning the user.");
  }
});

app.listen(PORT, () => console.log("Server running on port " + PORT));
