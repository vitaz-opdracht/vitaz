const query = require('./repositories/db').query;

const ruleQuery = 'SELECT * FROM regel WHERE enabled = 1 ORDER BY rule_order';

let ruleConfig;

setInterval(async () => {
    ruleConfig = (await query(ruleQuery)).rows;
}, 5000);

async function getRuleConfig() {
    if (ruleConfig == null) {
        ruleConfig = (await query(ruleQuery)).rows;
    }

    return ruleConfig;
}

module.exports = {
    getRuleConfig,
};
