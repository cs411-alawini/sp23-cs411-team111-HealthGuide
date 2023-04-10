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


app.get('/success', function(req, res) {
	res.send({'message': 'You have done it!'});
});

// this code is executed when the user presses the submit form button
app.post('/mark', function(req, res) {
	var UserId = req.body.UserId;
	var sql = `INSERT INTO users (UserId, Age, Gender, Country) VALUES (1002, 25, 'Male', 'US')`;
	

console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    res.redirect('/success');
  });
});


app.listen(80, function () {
	console.log('Node app is running on port 80');
});
