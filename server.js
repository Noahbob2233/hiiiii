
//NCESARIO PARA PRODUCCION
const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const app = express();

//BASE D DATOS
var db = require('./static/js/db.js');

//SESIONES
var session = require('express-session');

//ENCRIPTACION SHA256
var sha256 = require('js-sha256');

//SOCKETIO
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('http://localhost:'+port);
});

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

var sess;

//INICIO
app.all('/', function(req, res) {
	sess = req.session;
	//sesion automatica para pruebas
	// sess.userid = 1;
	// sess.user = 'admin';
	// var query = "SELECT name FROM users_chars WHERE user_id=?";
	// 	var query_var = [sess.userid];
	// 	db.Select(query, query_var).then(function(result){
	// 		var size = Object.size(result);
	// 		if(size>0){
	// 			sess.characters = result;
	// 			sess.characters_max = size;
	// 		}else{
	// 			sess.characters = [];
	// 			sess.characters_max = 0;
	// 		}
	// 		res.render('index.html', {
	// 			sess: sess
	// 		});
	// 	});
	//fin inicio automatico descomentar

	res.render('index.html', {
			sess: sess
		});
	delete sess.info;
});
//FIN INICIO

//USUARIOS
//LOGIN
app.post('/login', function(req, res){
	sess = req.session;

	var user = req.body.username || "";
	var pass = sha256(req.body.password) || "";

	var query_select = "SELECT name, id FROM users WHERE name=? AND password=?";
	var query_select_var = [user,pass];

	var page = req.body.url;

	//LOGUEAMOS
	db.Select(query_select, query_select_var).then(function(result){
		//SI SE ENCUENTRA EL USUARIO:
		if(typeof result[0] != 'undefined'){
		sess.userid = result[0].id;
		//MIRAMOS SUS PJS CREADOS
		var query = "SELECT name FROM users_chars WHERE user_id=?";
		var query_var = [result[0].id];
		db.Select(query, query_var).then(function(result){
			var size = Object.size(result);
			sess.user = user;
			if(size>0){
				sess.characters = result;
				sess.characters_max = size;
			}else{
				sess.characters = [];
				sess.characters_max = 0;
			}
			res.redirect(page);
		});
		//SI NO
		}else{
			sess.info = "El Usuario no existe";
			res.redirect(page);
		}

	}).catch((err) => setImmediate(() => { console.log(err); }));

});
//FIN LOGIN
//SIGN UP
app.post('/signup', function(req, res){

	var user = req.body.username || "";
	var pass = sha256(req.body.password) || "";
	var page = req.body.url;
	sess = req.session;
	if(pass == sha256(req.body.passwordalt)) {
		var query_select = "SELECT name FROM users WHERE name=?";
		var query_select_var = [user];
		var query_insert = "INSERT INTO users (name, password) VALUES (?,?)";
		var query_insert_var = [user, pass];

		db.Select(query_select, query_select_var).then(function(result){
			if(typeof result[0] != 'undefined'){
				sess.info = "Ya existe un Usuario con ese nombre.";
				res.redirect(page);
			}else{
				db.Insert(query_insert, query_insert_var).then(function(){
					sess.info = "Usuario creado correctamente. ¡Ya puedes iniciar sesión!";
					sess.characters_max = 0;
					res.redirect(page);
				});
			}

		}).catch((err) => setImmediate(() => { console.log(err); }));
	}
	else {
		sess.info = "Las contraseñas no coinciden";
		res.redirect(page);
	}


	
});
//FIN SIGN UP
//LOGOUT
app.post('/logout', function(req, res){
	sess = req.session;

	//guardamos los datos del pj
  //       var query = "UPDATE users_chars SET xPos=?, yPos=? WHERE name=?";
		// var query_var = [xPosMia, yPosMia, sess.character_name];
		// db.Select(query, query_var).then(function(){
			delete sess.user;
			delete sess.characters;
			delete sess.characters_max;
			delete sess.userid;
			res.render('index.html', {
					sess: sess
				});
		// });
});
//FIN LOGOUT
//FIN USUARIOS

//SOCKETIO
app.all('/game', function(req,res){
	sess = req.session;

	if(sess.user){
		if (sess.character_name) {
			var query = "SELECT * FROM users_chars WHERE name=? LIMIT 1";
			var query_var = [sess.character_name];
			db.Select(query, query_var).then(function(result){
			        sess.character_image=		 result[0].image;
			        sess.character_weapon=		 result[0].weapon;
			        sess.character_head=		 result[0].head;
			        sess.character_xPos=		 result[0].xPos;
			       	sess.character_yPos=		 result[0].yPos;
			        sess.character_direction=	 result[0].direction;
              sess.character_action=	 result[0].action;
			        sess.character_width=		 result[0].width;
			        sess.character_height=		 result[0].height;
			        sess.character_hp=		 	 result[0].hp;
			        sess.character_attack=		 result[0].attack;
			        sess.character_defense=		 result[0].defense;
			        sess.character_speed=		 result[0].speed;
			        res.render('game.html', {
					  	sess: sess
					});
			});
		}else{
			res.redirect('/');
		}
	}else{
		res.redirect('/');
	}


});

// Chatroom
var numUsers = 0;
var playersonline = [];
var xPosMia;
var yPosMia;
var hpMia;

io.on('connection', function (socket) {
  var addedUser = false;
  var players = [];

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (data) {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = data.name;
    ++numUsers;

    playersonline.push({
    	name: data.name,
      image: data.image,
      weapon: data.weapon,
      head: data.head,
      xPos: data.xPos,
      yPos: data.yPos,
      direction: data.direction,
      action: data.action,
      width: data.width,
      height: data.height,
      hp: data.hp,
      attack: data.attack,
      defense: data.defense,
      speed: data.speed
    });

    xPosMia = data.xPos;
    yPosMia = data.yPos;

    console.log("Añadimos alguien al array: "+JSON.stringify(playersonline));

    // console.log(JSON.stringify(playersonline));

    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers,
      username: socket.username
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers,
      playersonline: playersonline
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  socket.on('move', function(data){
  	for (var i = playersonline.length - 1; i >= 0; i--) {
  		if(playersonline[i].name === data.player.name){
  			playersonline[i].xPos = data.player.xPos;
  			playersonline[i].yPos = data.player.yPos;
  			playersonline[i].direction = data.player.direction;
        playersonline[i].action = data.player.action;
  			if (data.player.name === sess.character_name) {
  				xPosMia = data.player.xPos;
	  			yPosMia = data.player.yPos;
  			}
  		}
  	}
  	socket.broadcast.emit('someone moved', {playersonline: playersonline});
  });

  socket.on('die', function(data){
  	console.log("borramos de aqui: "+JSON.stringify(data.playersonline));
  	console.log("esto: "+data.name);

  	removeByAttr(data.playersonline, 'name', data.name);

  	playersonline = data.playersonline;

  	console.log('Borramos al muerto y se queda asi: '+JSON.stringify(playersonline));

  	socket.broadcast.emit('someone die', {playersonline: playersonline, playerDead: data.name});
  });

  socket.on('hit', function (data) {

    for (var i = playersonline.length - 1; i >= 0; i--) {
  		if(playersonline[i].name === data.enemy.name){
  			playersonline[i].hp = data.enemy.hp;
  			if (data.enemy.name === sess.character_name) {
  				hpMia = data.enemy.hp;
  			}
  		}
  	}

  	socket.broadcast.emit('someone hitted', {playersonline: playersonline});

  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;

      removeByAttr(playersonline, 'name', sess.character_name);

        //guardamos los datos del pj
  //       var query = "UPDATE users_chars SET xPos=?, yPos=? WHERE name=?";
		// var query_var = [xPosMia, yPosMia, sess.character_name];

		// db.Select(query, query_var).then(function(){
			// echo globally that this client has left
		      socket.broadcast.emit('user left', {
		        username: socket.username,
		        numUsers: numUsers
		      });
		// });

    }
  });
});
//FIN SOCKETIO

//PANTALLA DEL CHARACTER
app.all('/character', function(req,res){
	sess = req.session;
	if(sess.user && req.body.charname){
	var query = "SELECT * FROM users_chars WHERE name=?";
	var query_var = [req.body.charname];
	db.Select(query, query_var).then(function(result){
		sess.character_name = result[0].name;
		sess.character_lvl = result[0].lvl;
		sess.character_hp = result[0].hp;
		sess.character_attack = result[0].attack;
		sess.character_defense = result[0].defense;
		sess.character_speed = result[0].speed;
		res.render('character.html', {
			sess: sess
		});
	});
	}else{
		res.redirect('/');
	}
});
//FIN DE LA PANTALLA DEL CHARACTER

//PANTALLA DE CREACION DE PJ
app.all('/newchar', function(req,res){
	sess = req.session;
	if(sess.user && sess.characters_max<3){
	var query = ""
				+ "SELECT c.id, c.name, c.hp, c.attack, c.defense, c.speed "
				+ "FROM chars c "
				+ "LEFT JOIN type_chars tc ON c.type_id=tc.id "
				+ "WHERE tc.name='sample'";

	var query_var = [];
	db.Select(query, query_var).then(function(result){
		res.render('newcharacter.html', {
			result: result,
			sess: sess
		});
	});
}else{
	res.redirect('/');
}
});
//FIN DE LA PANTALLA DEL CHARACTER


//URLS PARA PEDIR DATOS A LA BBDD

//LISTADO DE CHARS DE EJEMPLO PARA LA CREACION

app.post('/loadsamplechars', function(req,res){
	sess = req.session;

	var query = "SELECT * FROM chars WHERE id=?";
	var query_var = [req.body.search];

	db.Select(query, query_var).then(function(result){
		res.send(result[0]);
	});
});

//GUARDAMOS EL CHAR SELECCIONADO EN LA BASE DE DATOS PARA EL USUARIO

app.post('/saveselectedchar', function(req,res){
	sess = req.session;

	var query = "INSERT INTO users_chars (name,lvl,hp,attack,defense,speed,user_id,image,weapon,head,xPos,yPos,direction,width,height) VALUES (?,1,?,?,?,?,?,'armor.png','greatstaff.png','womenhead.png',7,7,1,128,128)";
	var query_var = [req.body.name,req.body.hp,req.body.attack,req.body.defense,req.body.speed,sess.userid];
	db.Select(query, query_var).then(function(){
		sess.characters.push({name: req.body.name});
		sess.characters_max += 1;
		sess.character_name = req.body.name;
		sess.character_lvl = 1;
		sess.character_hp = req.body.hp;
		sess.character_attack = req.body.attack;
		sess.character_defense = req.body.defense;
		sess.character_speed = req.body.speed;
		res.render('character.html', {
			sess: sess
		});
	});
});

// ELIMINAMOS EL PJ SELECCIONADO

app.post('/deleteselectedchar', function(req,res){
	sess = req.session;

	var query = "DELETE FROM users_chars WHERE user_id=? AND name=?";
	var query_var = [sess.userid,req.body.name];

	db.Select(query, query_var).then(function(){
		removeByAttr(sess.characters, 'name', req.body.name);
		sess.characters_max -= 1;
		res.render('index.html', {
			sess: sess
		});
	});
});

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

var removeByAttr = function(arr, attr, value){
    var i = arr.length;
    while(i--){
       if( arr[i]
           && arr[i].hasOwnProperty(attr)
           && (arguments.length > 2 && arr[i][attr] === value ) ){

           arr.splice(i,1);

       }
    }
    return arr;
};
