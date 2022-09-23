const fs = require('fs');
const path = require('path');

module.exports.appSubscriptionCreate = fs.readFileSync(path.join(__dirname, 'appSubscriptionCreate.gql'), 'utf8');
