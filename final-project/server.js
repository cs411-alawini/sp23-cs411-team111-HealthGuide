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
app.post('/login', function(req, res) {
        var username = req.body.username;
	var password = req.body.password;
	console.log(username);
	console.log(password);         

        var sql = `SELECT * FROM login WHERE Username = '${username}' AND Password = '${password}'`;

        connection.query(sql, function(err, result) {
           console.log(result);
           if (err) {
             res.send(err)
             return;
           } else if (result.length > 0) {
	     result.forEach(function(data) {
	       global_username = data.Username;
	       global_userid = data.UserId;
	     });
             res.render('home', { title: 'Home Page'});
           } else {
	     res.render('index', { title: 'Sign In Page'});
	   }
         });
});

app.get('/signin', function(req, res) {
        res.render('signin', { title: 'Sign In Page' });
});

app.get('/home', function(req, res) {
	res.render('home', { title: 'Home Page' });
});

app.post('/userpage', function(req, res) {
        console.log(global_username);
	console.log(global_userid);

        var sql = `SELECT * FROM users WHERE UserId = '${global_userid}'`;

        connection.query(sql, function(err, result) {
           console.log(result);
           if (err) {
             res.send(err)
             return;
           } else {
	     result[0].Username = global_username;
	     console.log(result);
             res.render('userpage', { title: 'User Page', action: 'list', sampleData:result});
           }
         });
});

app.get('/update-account', function(req, res) {
        res.render('update-account', { title: 'Account Update Page' });
});


app.post('/search', function(req, res) {
	var illness = req.body.illness;
	console.log(illness);
	var sql = `SELECT * FROM illnesses WHERE Name = '${illness}'`;

	connection.query(sql, function(err, result) {
 	   console.log(result);
	   if (err) {
 	     res.send(err)
 	     return;
 	   } else {
 	     res.render('search', { title: 'Search Page', action: 'list', sampleData:result});
	   }
 	 });
});

app.post('/signup-info', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var age = req.body.age;
	var gender = req.body.gender;
	var country = req.body.country;
	global_username = req.body.username;
	var sql_login = `INSERT INTO login (Username, UserId, Password) VALUES ('${username}', 1005, '${password}')`;
	var sql_users = `INSERT INTO users (UserId, Age, Gender, Country) VALUES (1005, '${age}', '${gender}', '${country}')`;
	var sql_userid = `SELECT Max(UserId) as newId FROM users`;

console.log(sql_login);
  connection.query(sql_userid, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
	console.log(result);
        console.log(result[0].newId);
	global_userid = result[0].newId + 1;
  });

  connection.query(sql_users, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
	console.log(result.affectedRows);
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


app.post('/update-info', function(req, res) {
        var password = req.body.password;
        var age = req.body.age;
        var gender = req.body.gender;
        var country = req.body.country;

        var sql_login = `UPDATE login SET password = '${password}' WHERE UserID = '${global_userid}'`;
        var sql_users = `UPDATE users SET age = '${age}', gender = '${gender}', country = '${country}' WHERE UserID = '${global_userid}'`;

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

app.post('/advanced1', function(req, res) {
        var sql = `SELECT IllnessName, AVG(Age) as avgAge FROM users u JOIN reviews r using(UserId) GROUP BY IllnessName`;

        connection.query(sql, function(err, result) {
           console.log(result);
           if (err) {
             res.send(err)
             return;
           } else {
             res.render('advanced1', { title: 'Advanced Query 1 Page', action: 'list', sampleData:result});
           }
         });
});

app.post('/advanced2', function(req, res) {
	var illness = req.body.illness;
	var lowAge = req.body.lowAge;
	var highAge = req.body.highAge;
	var gender = req.body.gender;
	console.log(illness);
	console.log(lowAge);
	console.log(highAge);
	console.log(gender);

        var sql = `SELECT IllnessName, count(u.UserId) as totalCount FROM users u JOIN reviews r ON (u.userId = r.userId) JOIN illnesses i on (i.Name = r.IllnessName) WHERE (i.Name = '${illness}') AND (u.age >= '${lowAge}') AND (u.age <= '${highAge}') AND (u.Gender = '${gender}') GROUP BY IllnessName`;

        connection.query(sql, function(err, result) {
           console.log(result);
           if (err) {
             res.send(err)
             return;
           } else {
             res.render('advanced2', { title: 'Advanced Query 2 Page', action: 'list', sampleData:result});
           }
         });
});


app.post('/reviews', function(req, res) {
	var illness = req.body.illness;
        console.log(illness);

        var sql = `CALL ReviewsPage('${global_userid}', '${illness}')`;

        connection.query(sql, function(err, result) {
           console.log(result);
           if (err) {
             res.send(err)
             return;
           } else {
             res.render('reviews', { title: 'Reviews Page', action: 'list', sampleData:result[0]});
           }
         });
});

app.listen(80, function () {
	console.log('Node app is running on port 80');
});
