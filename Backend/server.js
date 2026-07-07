const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const aiRoutes = require("./routes/aiRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const rawOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""));

console.log("CORS allowed origins:", rawOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // same-origin / curl / server-to-server
      if (rawOrigins.includes(origin.replace(/\/$/, ""))) {
        return callback(null, true);
      }
      console.error("CORS blocked origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api", aiRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("CivicAI API is running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`CivicAI server on :${PORT}`));
