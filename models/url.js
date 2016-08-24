
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UrlSchema =  Schema({
    name: String,
    url: {
        type: String,
        unique: true
    },
    userId: String
});

module.exports = mongoose.model('Url', UrlSchema);