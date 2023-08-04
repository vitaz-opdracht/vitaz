const db = require('./repositories/db');

const ruleQuery = 'SELECT * FROM regel WHERE enabled = 1 ORDER BY rule_order';
let ruleConfig = db.prepare(ruleQuery).all();
setInterval(() => {
    ruleConfig = db.prepare(ruleQuery).all();
}, 5000);

function getRuleConfig() {
    return ruleConfig;
}

module.exports = {
    getRuleConfig,
};
