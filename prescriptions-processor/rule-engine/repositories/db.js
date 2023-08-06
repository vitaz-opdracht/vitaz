const {Client} = require('pg');
let db;

async function initDatabaseConnection() {
    db = new Client({
        user: 'postgres',
        password: 'postgres',
        host: process.env.DATABASE_HOST || 'localhost',
        database: 'db',
        port: 5432
    });
    await db.connect();
}

async function query(toQuery) {
    return await db.query(toQuery);
}

module.exports = {
    initDatabaseConnection,
    query
};
