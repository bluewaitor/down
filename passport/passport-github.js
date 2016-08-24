var GithubStrategy = require('passport-github2').Strategy;
var config = require('../config');

module.exports = function (app, passport) {
    passport.use(new GithubStrategy({
            clientID: config.githubConfig.clientID,
            clientSecret: config.githubConfig.clientSecret,
            callbackURL: config.githubConfig.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
            console.log(profile);
            return done(null, profile);
        }
    ));

    app.get('/auth/github',
        passport.authenticate('github', { scope: [ 'user:email' ] }));

    app.get('/auth/github/callback',
        passport.authenticate('github', { failureRedirect: '/login' }),
        function(req, res) {
            res.redirect('/');
        });
};