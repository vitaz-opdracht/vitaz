const query = require('./db').query;

async function getPrescriberSpecialism(prescriberId) {
    return (await query({text: 'SELECT specid FROM arts WHERE id = $1', values: [prescriberId]})).rows[0]?.specid;
}

module.exports = {
    getPrescriberSpecialism,
};
