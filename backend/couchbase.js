import couchbase from "couchbase";

let cluster;
let bucket;
let collection;

export async function connectToCouchbase() {
  const {
    COUCHBASE_CONNSTR,
    COUCHBASE_USERNAME,
    COUCHBASE_PASSWORD,
    COUCHBASE_BUCKET,
  } = process.env;

  try {
    if (!cluster) {
      console.log("🔗 Connecting to Couchbase...");
      cluster = await couchbase.connect(COUCHBASE_CONNSTR, {
        username: COUCHBASE_USERNAME,
        password: COUCHBASE_PASSWORD,
      });
      bucket = cluster.bucket(COUCHBASE_BUCKET);
      collection = bucket.defaultCollection();
      console.log(`✅ Connected to Couchbase bucket: ${COUCHBASE_BUCKET}`);
    }
  } catch (err) {
    console.error("❌ Couchbase connection error:", err);
    throw err;
  }
}

export async function savePunch(punch) {
  try {
    const id = `punch::${Date.now()}`;
    await collection.insert(id, punch);
    console.log("✅ Punch saved:", id);
    return { id, ...punch };
  } catch (err) {
    console.error("❌ Error saving punch:", err);
    throw err;
  }
}

export async function getAllPunches() {
  try {
    const query = `SELECT META().id, * FROM \`${process.env.COUCHBASE_BUCKET}\` LIMIT 100;`;
    const result = await cluster.query(query);
    const punches = result.rows.map(row => row[process.env.COUCHBASE_BUCKET]);
    console.log(`✅ Retrieved ${punches.length} punches`);
    return punches;
  } catch (err) {
    console.error("❌ Error fetching punches:", err);
    throw err;
  }
}






















// import couchbase from "couchbase";

// let bucket;

// export async function connectToCouchbase() {
//   try {
//     const cluster = await couchbase.connect(process.env.COUCHBASE_CONNSTR, {
//       username: process.env.COUCHBASE_USERNAME,
//       password: process.env.COUCHBASE_PASSWORD,
//     });
//     bucket = cluster.bucket(process.env.COUCHBASE_BUCKET);
//     console.log("✅ Connected to Couchbase");
//   } catch (err) {
//     console.error("❌ Couchbase connection failed:", err);
//   }
// }

// export async function insertPunchIn(time) {
//   const collection = bucket.defaultCollection();
//   const id = `punchin_${Date.now()}`;
//   const doc = { id, time, createdAt: new Date().toISOString() };
//   await collection.insert(id, doc);
//   return doc;
// }

// export async function getAllPunchIns() {
//   const query = "SELECT META().id, * FROM `" + process.env.COUCHBASE_BUCKET + "` LIMIT 50";
//   const result = await bucket.scope("_default").query(query);
//   return result.rows;
// }
