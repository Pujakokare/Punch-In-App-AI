import couchbase from "couchbase";

let bucket;

export async function connectToCouchbase() {
  try {
    const cluster = await couchbase.connect(process.env.COUCHBASE_CONNSTR, {
      username: process.env.COUCHBASE_USERNAME,
      password: process.env.COUCHBASE_PASSWORD,
    });
    bucket = cluster.bucket(process.env.COUCHBASE_BUCKET);
    console.log("✅ Connected to Couchbase");
  } catch (err) {
    console.error("❌ Couchbase connection failed:", err);
  }
}

export async function insertPunchIn(time) {
  const collection = bucket.defaultCollection();
  const id = `punchin_${Date.now()}`;
  const doc = { id, time, createdAt: new Date().toISOString() };
  await collection.insert(id, doc);
  return doc;
}

export async function getAllPunchIns() {
  const query = "SELECT META().id, * FROM `" + process.env.COUCHBASE_BUCKET + "` LIMIT 50";
  const result = await bucket.scope("_default").query(query);
  return result.rows;
}
