const path = require("path");
const db = require('better-sqlite3')(path.join(__dirname, '../../../emb.db'));
db.pragma('journal_mode = WAL');

module.exports = db;
