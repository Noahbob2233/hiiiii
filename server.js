const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const app = express();
var ZeldaTable = require('./ZeldaTable.js');
var session = require('express-session');
// Set view engine
app.set('view engine', 'html');
var env = nunjucks.configure('views', {
	autoescape: true,
	express: app
});

app.use(session({
  secret: 'whatisthis',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Set views folder
app.set('views', __dirname + '/views');
// Set static files folder
app.use('/static', express.static(__dirname + '/static'));
// Parseh pa kohe balyavreh der foln
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
// Global variables
env.addGlobal('url', '');

app.listen(3000, function() {
	console.log('http://127.0.0.1:3000');
});

app.get('/', function(req, res) {
	sess = req.session;
	res.render('index.html', {
			title : 'prueba',
				sess: sess 
		});
});

var sess;

app.all('/armas-melee', function(req, res){
	sess = req.session;

	var nombre = req.body.name || "";
	var damdef = req.body.damdef || "";
	var durability = req.body.durability || "";

	var query = {$and:[{"name": {$regex : ".*"+nombre+".*", "$options" : "i"}},{"damage":{$regex : ".*"+ damdef+".*"}},{"durability": {$regex : ".*"+ durability+".*"}}]};

	var valores = {"name":nombre,"damdef":damdef,"durability":durability};
	
	ZeldaTable.Select();
});
app.all('/armas-range', function(req, res) {
	sess = req.session;

	var nombre = req.body.name || "";
	var damdef = req.body.damdef || "";
	var durability = req.body.durability || "";

	var query = {$and:[{"name": {$regex : ".*"+nombre+".*", "$options" : "i"}},{"damage":{$regex : ".*"+ damdef+".*"}},{"durability": {$regex : ".*"+ durability+".*"}}]};

	var valores = {"name":nombre,"damdef":damdef,"durability":durability};

	ZeldaTable.Select('ArmasRange', query).then(function(items) {
		ZeldaTable.Select('Comentarios', {}).then(function(comments) {
			res.render('armasrange.html', {
				items : items,
				comments: comments,
				valores: valores,
				sess: sess 
			});
			}, function(err) {
				res.render('index.html', { 
					title : 'prueba'
				});
		});
	}, function(err) {
		res.render('index.html', {
			title : 'prueba'
		});
	});
});

app.all('/escudos', function(req, res) {
	sess = req.session;
	
	var nombre = req.body.name || "";
	var damdef = req.body.damdef || "";
	var durability = req.body.durability || "";

	var query = {$and:[{"name": {$regex : ".*"+nombre+".*", "$options" : "i"}},{"defense":{$regex : ".*"+ damdef+".*"}},{"durability": {$regex : ".*"+ durability+".*"}}]};

	var valores = {"name":nombre,"damdef":damdef,"durability":durability};

	ZeldaTable.Select('Escudos', query).then(function(items) {
		ZeldaTable.Select('Comentarios', {}).then(function(comments) {
			res.render('escudos.html', {
				items : items,
				comments: comments,
				valores: valores,
				sess: sess 
			});
			}, function(err) {
				res.render('index.html', { 
					title : 'prueba'
				});
		});
	}, function(err) {
		res.render('index.html', {
			title : 'prueba'
		});
	});
});

app.post('/insertcomment', function(req, res){
	sess = req.session;
	var msg = req.body.message || "Mensaje eliminado por moderación";
	var query = {"user": sess.user, "img": sess.img, "date": new Date(Date.now()).toLocaleDateString(), "message": msg};
	var page = req.body.url;
	ZeldaTable.Insert('Comentarios', query).then(function() {
		res.redirect(page);
	}, function(err) {
		res.render('index.html', {
			title : 'prueba'
		});
	});
});

app.post('/login', function(req, res){
	var user = req.body.username || "";
	var pass = req.body.password || "";

	var query = {"user": user, "password": pass};
	var page = req.body.url;
	sess = req.session;
	ZeldaTable.Select('Usuarios', query).then(function(items) {
		if(typeof items[0] == 'undefined'){
			res.redirect(page);
		}else{
			sess.user = items[0].user;
			sess.img = items[0].img;
			res.redirect(page);
		}
	}, function(err) {
		res.render('index.html', {
			title : 'prueba'
		});
	});
});

app.post('/signup', function(req, res){
	var num = Math.floor(Math.random() * (5)) + 1;

	var user = req.body.username || "";
	var pass = req.body.password || "";

	var query = {"user": user, "password": pass, "img": "/static/img/Usuarios/"+num+".png"};
	var query2 = {"user": user};
	sess = req.session;
	var page = req.body.url;
	ZeldaTable.Select('Usuarios', query2).then(function(items) {

		if(typeof items[0] == 'undefined'){
			ZeldaTable.Insert('Usuarios', query).then(function() {
				res.redirect(page);
			}, function(err) {
				res.render('index.html', {
					title : 'prueba'
				});
			});
			res.redirect(page);
		}else{
			res.redirect(page);
		}


	}, function(err) {
		res.render('index.html', {
			title : 'prueba'
		});
	});
});

app.post('/logout', function(req, res){
	sess = req.session;
	delete sess.user;
	delete sess.img;
	var page = req.body.url;
	res.redirect(page);
});