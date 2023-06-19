const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.dental = require('./dental.model')(mongoose);

module.exports = db;
