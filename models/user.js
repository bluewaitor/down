/**
 * Created by bluewaitor on 2016/8/2 0002.
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;


var UserSchema =  Schema({
    name: String,
    password: String,
    admin: Boolean
});

UserSchema.methods.generateHash = function (password) {
    console.log('222');
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);