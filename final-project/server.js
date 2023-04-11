var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql2');
var path = require('path');
var connection = mysql.createConnection({
		host: '35.222.188.213',
		user: 'root',
		password: 'team111', 
		database: 'team111'
});

connection.connect;


var global_username;
var global_userid;

var app = express();


// set up ejs view engine

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(express.static(__dirname + '../public'));

/* GET home page, respond by rendering index.ejs */
app.get('/', function(req, res) {
	res.render('index', { title: 'Mark Attendance' });
});


// this code is executed when the user presses the submit form button
app.get('/login', function(req, res) {
        res.render('login', { title: 'Login Page' });
});

app.get('/signin', function(req, res) {
        res.render('signin', { title: 'Sign In Page' });
});

app.get('/home', function(req, res) {
	res.render('home', { title: 'Home Page' });
});

app.get('/userpage', function(req, res) {
        console.log(global_username);
	console.log(global_userid);
	res.render('userpage', { title: 'User Page' });
});


app.post('/signup-info', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var age = req.body.age;
	var gender = req.body.gender;
	var country = req.body.country;
	global_username = req.body.username;
	global_userid = 1005;
	var sql_login = `INSERT INTO login (Username, UserId, Password) VALUES ('${username}', 1005, '${password}')`;
	var sql_users = `INSERT INTO users (UserId, Age, Gender, Country) VALUES (1005, '${age}', '${gender}', '${country}')`;

console.log(sql_login);
  connection.query(sql_users, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
  });
  connection.query(sql_login, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    res.redirect('/home');
  });
});


app.post('/delete-account', function(req, res) {
        var sql_del_login = `delete from login where UserId = '${global_userid}'`;
        var sql_del_users = `delete from users where UserId = '${global_userid}'`;


console.log(sql_del_login);
  connection.query(sql_del_login, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
  });
  connection.query(sql_del_users, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    res.redirect('/');
  });
});


app.listen(80, function () {
	console.log('Node app is running on port 80');
});
