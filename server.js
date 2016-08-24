var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var User = require('./models/user');
var config = require('./config');
var jwt = require('jsonwebtoken');
var session = require('express-session');
var passport = require('passport');


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

require('./passport/index')(app, passport);

require('./api/index')(app);

app.listen(port, function () {
    console.log('app run on localhost:'+port);
});