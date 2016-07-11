var express = require('express');
var faker = require('faker');
var cors = require('cors');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var app = express();
app.use(cors());
app.use(express.static(__dirname+'/public'));

//使用body-parser
//接收application/x-www-form-urlencoded的表单提交 extended为true的时候使用qs模块解析字符串,false使用querystring模块
app.use(bodyParser.urlencoded({ extended: false }));
//接收json数据
app.use(bodyParser.json());

//打印请求log
app.use(morgan('tiny'));

app.get('/random-user', function(req, res){
    var user = faker.helpers.userCard();
    user.avatar = faker.image.avatar();
    res.json(user);
});

app.listen(3000, function () {
    console.log('app run on localhost:3000');
});