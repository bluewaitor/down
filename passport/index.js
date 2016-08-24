
module.exports = function (app, passport) {
    require('./passport-local')(app, passport);
    require('./passport-github')(app, passport);
};