const db = require('./db');

function getPrescriberSpecialism(prescriberId) {
    return db.prepare('SELECT specid FROM arts WHERE id = ?').pluck().get(prescriberId);
}

module.exports = {
    getPrescriberSpecialism,
};
