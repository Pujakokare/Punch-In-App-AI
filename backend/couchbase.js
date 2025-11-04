// Helper to connect to Couchbase
const couchbase = require('couchbase');

let cluster, bucket, collection;

/**
 * Call initCouchbase() once at startup.
 * Reads env vars:
 * - COUCHBASE_CONNSTR
 * - COUCHBASE_USERNAME
 * - COUCHBASE_PASSWORD
 * - COUCHBASE_BUCKET
 */
async function initCouchbase() {
  if (cluster) return { cluster, bucket, collection };

  const {
    COUCHBASE_CONNSTR,
    COUCHBASE_USERNAME,
    COUCHBASE_PASSWORD,
    COUCHBASE_BUCKET,
  } = process.env;

  if (!COUCHBASE_CONNSTR || !COUCHBASE_USERNAME || !COUCHBASE_PASSWORD || !COUCHBASE_BUCKET) {
    throw new Error('Missing Couchbase environment variables. Please set COUCHBASE_CONNSTR, COUCHBASE_USERNAME, COUCHBASE_PASSWORD, COUCHBASE_BUCKET');
  }

  cluster = await couchbase.connect(COUCHBASE_CONNSTR, {
    username: COUCHBASE_USERNAME,
    password: COUCHBASE_PASSWORD,
  });

  bucket = cluster.bucket(COUCHBASE_BUCKET);
  collection = bucket.defaultCollection();

  return { cluster, bucket, collection };
}

module.exports = { initCouchbase };
