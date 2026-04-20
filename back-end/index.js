const { PrismaClient } = require("@prisma/client");
const { withAccelerate } = require("@prisma/extension-accelerate");
const { openCardPack } = require("./src/openCardPack.ts");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const prisma = new PrismaClient().$extends(withAccelerate());

const express = require("express");
const cors = require("cors");
const app = express();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const PORT = 4000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const bannedEmail = await prisma.bannedEmail.findFirst({
      where: { email: email },
    });

    if (bannedEmail) {
      return res
        .status(400)
        .json("This email has been banned from the platform.");
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

app.get("/api/community", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        tradeList: {
          some: {
            status: "AVAILABLE",
          },
        },
      },
      select: {
        id: true,
        username: true,
        profilePic: true,
        tradeList: {
          where: {
            status: "AVAILABLE",
          },
          include: {
            card: true,
          },
        },
      },
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json("An error occurred while fetching community data.");
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username: username }, { email: username }],
      },
    });

    if (!existingUser) {
      return res
        .status(400)
        .json({ ok: false, message: "Invalid credentials!" });
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      return res
        .status(400)
        .json({ ok: false, message: "Invalid credentials!" });
    }

    const { password: _, ...safeUser } = existingUser;

    const token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.json({ ok: true, user: safeUser, token });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ ok: false, message: "An error occurred during login." });
  }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({ ok: false, message: "No token provided" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ ok: false, message: "Invalid token" });
    req.user = user;
    next();
  });
};

app.get("/users/:id", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!user)
      return res.status(404).json({ ok: false, message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ ok: false, message: "Failed to fetch user" });
  }
});

app.get("/api/inventory/:id", async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    let inventory = await prisma.inventory.findMany({
      where: { userId: userId },
      include: { card: true },
    });

    const tradeList = await prisma.tradeList.findMany({
      where: { userId: userId, status: "AVAILABLE" },
      select: { cardId: true }
    });

    const tradeCardIds = new Set(tradeList.map(t => t.cardId));

    inventory = inventory.map(item => ({
      ...item,
      isForTrade: tradeCardIds.has(item.cardId)
    }));

    res.json(inventory);
  } catch (error) {
    console.error("Prisma Error:", error);
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
});

app.post("/api/trade-list/add", async (req, res) => {
  const { userId, cardId } = req.body;
  try {
    await prisma.tradeList.upsert({
      where: { userId_cardId: { userId, cardId } },
      update: { status: "AVAILABLE" },
      create: { userId, cardId, status: "AVAILABLE" },
    });
    res.status(200).json({ message: "Added" });
  } catch (error) {
    res.status(500).json({ error: "Failed to list" });
  }
});

app.post("/api/trade-list/remove", async (req, res) => {
  const { userId, cardId } = req.body;
  try {
    await prisma.tradeList.delete({
      where: { userId_cardId: { userId, cardId } },
    });
    res.status(200).json({ message: "Removed" });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove" });
  }
});

app.post("/api/open-pack", async (req, res) => {
  try {
    const { userId, packSize, packCost } = req.body;

    // Validate input
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Call the TypeScript function
    const result = await openCardPack(userId, packSize || 5, packCost || 0);

    // Daily pack opened
    if (packSize === 5 && packCost === 0) {
      const updateUser = await prisma.user.update({
        where: { id: userId },
        data: { lastDailyPack: new Date() },
      });
    }

    // Return the new cards to the frontend
    res.json(result);
  } catch (error) {
    console.error("Pack Opening Error:", error.message);
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/sell-card", async (req, res) => {
  const { userId, cardId, sellPrice } = req.body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      //Update user's currency
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { currency: { increment: sellPrice } },
      });
      //Find inventory record
      const inventoryItem = await tx.inventory.findFirst({
        where: { userId: userId, cardId: cardId },
      });

      if (!inventoryItem) {
        throw new Error("Card not found in inventory");
      }
      if (inventoryItem.quantity > 1) {
        await tx.inventory.update({
          where: { id: inventoryItem.id },
          data: { quantity: { decrement: 1 } },
        });
      } else {
        await tx.inventory.delete({
          where: { id: inventoryItem.id },
        });

        await tx.tradeList.deleteMany({ where: { userId, cardId } });
      }
      return updatedUser;
    });
    res.status(200).json({
      message: "Card sold successfully",
      newCurrency: result.currency,
    });
  } catch (error) {
    console.error("Sell error:", error);
    res.status(500).json({ error: "Failed to process sale" });
  }
});

app.get("/admin/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        isAdmin: false,
      },
      select: {
        id: true,
        username: true,
        email: true,
        profilePic: true,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json("An error occurred while fetching users.");
  }
});

app.get("/admin/banned-emails", async (req, res) => {
  try {
    const bannedEmails = await prisma.bannedEmail.findMany({
      select: {
        id: true,
        email: true,
      },
    });
    res.status(200).json(bannedEmails || []);
  } catch (error) {
    res.status(500).json("An error occurred while fetching banned emails.");
  }
});

app.delete("/admin/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    await prisma.bannedEmail.create({
      data: {
        email: user.email,
      },
    });

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "User banned successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while banning the user." });
  }
});

app.listen(PORT, () => console.log("Server running on port " + PORT));
