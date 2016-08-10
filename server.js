var express = require('express');
var faker = require('faker');
var cors = require('cors');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var User = require('./models/user');
var config = require('./config');
var jwt = require('jsonwebtoken');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var app = express();

var port = process.env.PORT || 8080;

//连接mongoDB
mongoose.connect(config.database);
//设置密钥
app.set('superSecret', config.secret);


//设置跨域请求共享
app.use(cors());
//设置静态目录
app.use(express.static(__dirname+'/public'));

//使用body-parser
//接收application/x-www-form-urlencoded的表单提交 extended为true的时候使用qs模块解析字符串,false使用querystring模块
app.use(bodyParser.urlencoded({ extended: false }));
//接收json数据
app.use(bodyParser.json());

//打印请求log
app.use(morgan('dev'));

//session
app.use(session({
    secret: app.get('superSecret'),
    saveUninitialized: false,
    resave: false
}));

app.use(passport.initialize());
app.use(passport.session());

var router = express.Router();

//序列化用户
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use('local-signup', new LocalStrategy({
    usernameField: 'name',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, name, password, done) {
    process.nextTick(function () {
        User.findOne({name: name}, function (err, user) {
            if(err)
                return done(err);
            if(!user){
                var newUser = new User();
                newUser.name = name;
                newUser.password = newUser.generateHash(password);
                newUser.admin = 0;

                newUser.save(function (err) {
                    if(err){
                        throw err;
                    }
                    return done(null, newUser, {success: true});
                });
            }else{
                return done(null, false, {success: false, message: 'the name has been taken'});
            }
        });
    });
}));
router.post('/signup1', function(req, res){
    passport.authenticate('local-signup',function (err, user, info) {
        if(err) throw err;
        if(user){
            res.json(user);
        }
        res.json(info);
    })(req, res);
});

router.post('/auth', function (req, res) {
    User.findOne({name: req.body.name}, function (err, user) {
        if(err) throw err;
        if( !user ){
            res.json({success: false, message: 'Auth failed. User not found.'});
        }else if( user ){
            if( !user.validPassword(req.body.password)){
                res.json({success: false, message: 'Auth failed. Wrong password.'});
            }else{
                var token = jwt.sign(user, app.get('superSecret'), {
                    expiresIn: 1440 //24小时过期
                });

                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }
        }
    });
});



//注册
router.post('/signup', function (req, res) {
    User.findOne({name: req.body.name}, function (err, user) {
        if(err) throw err;
        if(!user){
            var newUser = new User();
            newUser.name = req.body.name;
            newUser.password = newUser.generateHash(req.body.password);
            newUser.admin = 0;

            newUser.save(function (err) {
                if(err) throw err;
                res.json({
                    success: true
                });
            });
        }else{
            res.json({
                success: false,
                message: 'user name exist'
            });
        }
    });
});

router.use(function (req, res, next) {
    var token = req.body.token || req.query.token || req.header['x-access-token'];
    if(token){
        jwt.verify(token, app.get('superSecret'), function (err, decoded) {
            if(err){
                return res.json({
                    success: false,
                    message: err.message
                });
            }else{
                req.decoded = decoded;
                next();
            }
        });
    }else{
        return res.status(403).send({
            success: false,
            message: 'No token provided'
        });
    }
});

//需要token才能访问的用router, 不需要token能访问的用app
router.get('/users', function (req, res) {
    User.find({},function (err, users) {
        if(err) throw err;
        res.json({
            users: users
        });
    });
});


app.get('/random-user', function(req, res){
    var user = faker.helpers.userCard();
    user.avatar = faker.image.avatar();
    res.json(user);
});

app.use(router);

app.listen(port, function () {
    console.log('app run on localhost:'+port);
});