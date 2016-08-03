var express = require('express');
var faker = require('faker');
var cors = require('cors');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var User = require('./models/user');
var config = require('./config');
var jwt = require('jsonwebtoken');
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
app.use(morgan('tiny'));

var router = express.Router();

router.post('/auth', function (req, res) {
    User.findOne({name: req.body.name}, function (err, user) {
        if(err) throw err;
        if( !user ){
            res.json({success: false, message: 'Auth failed. User not found.'});
        }else if( user ){
            if( user.password != req.body.password){
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
    })
});

router.post('/signup', function (req, res) {
    console.log(req.body.name);


    User.findOne({name: req.body.name}, function (err, user) {
        if(err) throw err;
        if(!user){
            var user = new User({
                name: req.body.name,
                password: req.body.password,
                admin: 0
            });
            user.save(function (err) {
                if(err) throw err;
                res.json({
                    success: true
                });
            })
        }else{
            res.json({
                success: false,
                message: 'user name exist'
            })
        }
    })
});


app.get('/random-user', function(req, res){
    var user = faker.helpers.userCard();
    user.avatar = faker.image.avatar();
    res.json(user);
});

app.use(router);

app.listen(port, function () {
    console.log('app run on localhost:3000');
});