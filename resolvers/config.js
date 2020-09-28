const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.HOST,
  port: process.env.PORT,
  database: process.env.DB_NAME,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
});

module.exports = { pool };
