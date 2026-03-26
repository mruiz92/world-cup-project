const { PrismaClient } = require('@prisma/client');
const { openCardPack } = require('./src/openCardPack.ts');

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

app.get('/users/:id', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(req.params.id) }
  });
  res.json(user);
});

app.get('/api/inventory/:id', async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const inventory = await prisma.inventory.findMany({
      where: {
        userId: userId,
      },
      include: {
        card: true,
      },
    });

    res.json(inventory);
  } catch (error) {
    console.error("Prisma Error:", error);
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
});

app.post('/api/open-pack', async (req, res) => {
  try {
    const { userId, packSize, packCost } = req.body;

    // Validate input
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    console.log(`User ${userId} is attempting to open a pack...`);

    // Call the TypeScript function
    const result = await openCardPack(userId, packSize || 5, packCost || 0);

    // Return the new cards to the frontend
    res.json(result);
  } catch (error) {
    console.error("Pack Opening Error:", error.message);
    res.status(400).json({ error: error.message });
  }
});


app.listen(PORT, () => console.log("Server running on port " + PORT));
