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

app.listen(PORT, () => console.log("Server running on port " + PORT));
