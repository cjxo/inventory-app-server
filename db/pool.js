const { Pool } = require("pg");
const { PG_CONNECTION_STRING, ENV } = require("../utils/config");

const pool = new Pool({
  connectionString: PG_CONNECTION_STRING,
});

if (ENV !== "production") {
  pool.on("error", (err, client) => {
    console.error(err.stack);
  });
}

module.exports = pool;