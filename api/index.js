var express = require('express');
var jwt = require('jsonwebtoken');
var User = require('../models/user');

var Url = require('../models/url');

module.exports = function (app) {
    var router = express.Router();

    router.use(function (req, res, next) {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        if (token) {
            jwt.verify(token, app.get('superSecret'), function (err, decoded) {
                if (err) {
                    return res.json({
                        success: false,
                        message: err.message
                    });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.status(403).send({
                success: false,
                message: '请提供token'
            });
        }
    });

    router.route('/api/url/:id?')
        .get(function (req, res) {
            console.log(req.query.id);
            if (req.query.id) {
                Url.findById(req.query.id, function (err, url) {
                    if (err) {
                        throw err;
                    }
                    if (url) {
                        res.json(url);
                    }
                });
            } else {
                Url.find({}, function (err, url) {
                    if (err) {
                        throw err;
                    }
                    if (url) {
                        res.json(url);
                    }
                });
            }
        })
        .post(function (req, res) {
            var url = new Url();
            url.name = req.body.name;
            url.url = req.body.url;
            url.save(function (err) {
                if (err) {
                    throw err;
                }
                res.json(url);
            });
        });


    app.use(router);
};