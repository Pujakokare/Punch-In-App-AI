import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { connectToCouchbase, savePunch, getAllPunches } from "./couchbase.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 10000;

// ✅ Static frontend setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../frontend/build")));

// ✅ Connect to Couchbase
await connectToCouchbase();

// ✅ API: Get all punches
app.get("/api/punches", async (req, res) => {
  try {
    const punches = await getAllPunches();
    res.json(punches);
  } catch (err) {
    console.error("❌ Error in /api/punches:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ API: Save new punch
app.post("/api/punchin", async (req, res) => {
  try {
    const punch = req.body;
    const result = await savePunch(punch);
    res.json(result);
  } catch (err) {
    console.error("❌ Error in /api/punchin:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Serve frontend for all routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

// ✅ Start server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
