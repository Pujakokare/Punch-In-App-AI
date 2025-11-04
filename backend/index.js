import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { connectToCouchbase, insertPunchIn, getAllPunchIns } from "./couchbase.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔹 Resolve __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Couchbase connection
connectToCouchbase();

// ✅ API endpoints
app.post("/api/punchin", async (req, res) => {
  try {
    const { time } = req.body;
    if (!time) return res.status(400).json({ error: "Time is required" });
    const result = await insertPunchIn(time);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error inserting punch-in" });
  }
});

app.get("/api/punchin", async (req, res) => {
  try {
    const data = await getAllPunchIns();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error retrieving punch-ins" });
  }
});

// ✅ Serve React build
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

// ✅ PORT configuration for Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
