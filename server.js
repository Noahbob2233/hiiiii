const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const app = express();
var db = require('./DDBB/db.js');
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

	db.Select();
});

app.post('/insertcomment', function(req, res){
	sess = req.session;
	var msg = req.body.message || "Mensaje eliminado por moderación";
	var query = {"user": sess.user, "img": sess.img, "date": new Date(Date.now()).toLocaleDateString(), "message": msg};
	var page = req.body.url;
	ZeldaTabl.Insert('Comentarios', query).then(function() {
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

	var user = req.body.username || "";
	var pass = req.body.password || "";

	var query_select = "SELECT name FROM users WHERE name=?";
	var query_select_var = [user];
	var query_insert = "INSERT INTO users (name, password) VALUES (?,?)";
	var query_insert_var = [user, pass];

	sess = req.session;
	var page = req.body.url;
	db.Select(query_select, query_select_var).then(function(result){
		if(typeof result[0] != 'undefined'){	console.log('server: '+result[0].name);}
		else{ 
			console.log('Puedes crear el usuario'); 
			db.Insert(query_insert, query_insert_var).then(function(){
				console.log('usuario añadido correctamente');
				//redirigir a inicio con un valor para saber que el registro se ha completado
			});
		}

	}).catch((err) => setImmediate(() => { console.log(err); }));

	res.redirect(page);
});

app.post('/logout', function(req, res){
	sess = req.session;
	delete sess.user;
	delete sess.img;
	var page = req.body.url;
	res.redirect(page);
});
