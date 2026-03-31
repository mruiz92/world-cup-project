const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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

app.post("/login", async (req, res) => {
  const {username, password} = req.body;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          {username: username},
          {email: username}
        ]
      }
    });

    if (!existingUser) {
      return res.status(400).json({ok: false, message: "Invalid credentials!"});
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      return res.status(400).json({ok: false, message: "Invalid credentials!"});
    }

    const {password: _, ...safeUser} = existingUser;

    res.json({ok: true, user: safeUser});

  } catch (error) {
    console.error(error);
    res.status(500).json({ok: false, message: "An error occurred during login."});
  }
});

app.listen(PORT, () => console.log("Server running on port " + PORT));
