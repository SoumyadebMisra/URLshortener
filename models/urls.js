const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    long_url: String,
    short_url: String
});

const Url = new mongoose.model('url',urlSchema);

module.exports = Url;