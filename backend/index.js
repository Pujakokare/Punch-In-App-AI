import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import couchbase from "couchbase";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const {
  COUCHBASE_CONNSTR,
  COUCHBASE_USERNAME,
  COUCHBASE_PASSWORD,
  COUCHBASE_BUCKET,
  PORT = 10000,
} = process.env;

let cluster, bucket, collection;

async function connectCouchbase() {
  try {
    cluster = await couchbase.connect(COUCHBASE_CONNSTR, {
      username: COUCHBASE_USERNAME,
      password: COUCHBASE_PASSWORD,
    });
    bucket = cluster.bucket(COUCHBASE_BUCKET);
    collection = bucket.defaultCollection();
    console.log("✅ Connected to Couchbase");
  } catch (err) {
    console.error("❌ Couchbase connection failed:", err);
  }
}
connectCouchbase();

// 🔹 Health check
app.get("/", (req, res) => {
  res.send("✅ Backend running successfully");
});

// 🔹 GET punches
app.get("/api/punchin", async (req, res) => {
  try {
    const query = `
      SELECT META().id, timestamp, localTime, manual, note
      FROM `punchin`.`_punchin`.`_punchin`

      //FROM `punchin`.`_default`.`_default`--------bucket,collection,scope name

      ORDER BY timestamp DESC
      LIMIT 10;
    `;
    const result = await cluster.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching punches:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🔹 POST punch
app.post("/api/punchin", async (req, res) => {
  try {
    const { localTime, manual, note } = req.body;

    if (!localTime) {
      return res.status(400).json({ error: "Missing localTime" });
    }

    const punchDoc = {
      timestamp: new Date().toISOString(),
      localTime,
      manual: !!manual,
      note: note || "",
    };

    const id = `punch_${Date.now()}`;
    await collection.upsert(id, punchDoc);
    res.json({ success: true, id, ...punchDoc });
  } catch (err) {
    console.error("❌ Error saving punch:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));


















// import express from "express";
// import cors from "cors";
// import bodyParser from "body-parser";
// import path from "path";
// import { fileURLToPath } from "url";
// import { connectToCouchbase, insertPunchIn, getAllPunchIns } from "./couchbase.js";

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // 🔹 Resolve __dirname in ES module
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // ✅ Couchbase connection
// connectToCouchbase();

// // ✅ API endpoints
// app.post("/api/punchin", async (req, res) => {
//   try {
//     const { time } = req.body;
//     if (!time) return res.status(400).json({ error: "Time is required" });
//     const result = await insertPunchIn(time);
//     res.json(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Error inserting punch-in" });
//   }
// });

// app.get("/api/punchin", async (req, res) => {
//   try {
//     const data = await getAllPunchIns();
//     res.json(data);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Error retrieving punch-ins" });
//   }
// });

// // ✅ Serve React build
// app.use(express.static(path.join(__dirname, "../frontend/build")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
// });

// // ✅ PORT configuration for Render
// const PORT = process.env.PORT || 10000;
// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`✅ Server running on port ${PORT}`);
// });
