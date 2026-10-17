require('dotenv').config();
const fs = require('fs');
const path = require('path');
// Built-in SQLite (Node 22.13+ / Node 24): nothing to compile or install.
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.resolve(__dirname, process.env.DB_PATH || './timetable.db');
const db = new DatabaseSync(dbPath);

// Create the table and load the 10 sample records the first time only.
const exists = db
  .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='timetable'")
  .get();

if (!exists) {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  db.exec(schema);
  console.log('Database created and seeded from schema.sql');
}

module.exports = db;
