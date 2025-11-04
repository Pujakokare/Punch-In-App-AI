const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { initCouchbase } = require('./couchbase');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Utility: format server time to ISO
function nowISO() {
  return new Date().toISOString();
}

// Initialize Couchbase connection
let couch = null;
initCouchbase()
  .then(c => { couch = c; console.log('Connected to Couchbase'); })
  .catch(err => {
    console.error('Failed to connect to Couchbase:', err);
    process.exit(1);
  });

// POST /api/punch
// body: { localTime?: string, manual: boolean, note?: string }
app.post('/api/punch', async (req, res) => {
  try {
    if (!couch) return res.status(503).json({ error: 'DB not ready' });

    const { collection } = couch;
    const { localTime, manual = false, note = '' } = req.body;

    const id = 'punch::' + cryptoRandomId();
    const timestamp = nowISO();

    const doc = {
      id,
      timestamp,
      localTime: localTime || null,
      manual: !!manual,
      note: note || ''
    };

    await collection.upsert(id, doc);
    return res.status(201).json({ success: true, doc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// GET /api/punches
app.get('/api/punches', async (req, res) => {
  try {
    if (!couch) return res.status(503).json({ error: 'DB not ready' });
    const { cluster } = couch;
    const bucketName = process.env.COUCHBASE_BUCKET;

    // Simple N1QL query: list most recent punches
    const q = `SELECT p.* FROM \`${bucketName}\` p WHERE META(p).id LIKE "punch::%" ORDER BY p.timestamp DESC LIMIT 200;`;
    const result = await cluster.query(q);
    const rows = result.rows || [];
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Helper: lightweight random id
function cryptoRandomId() {
  // Node 18 has crypto.randomUUID, but we'll fallback
  try {
    return require('crypto').randomUUID();
  } catch (e) {
    return Math.random().toString(36).slice(2, 10);
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Punch backend listening on port ${PORT}`);
});
