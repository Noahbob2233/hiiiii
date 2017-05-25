DROP DATABASE IF EXISTS warbo;

CREATE DATABASE warbo;

USE warbo;

DROP TABLE IF EXISTS type_maps;

CREATE TABLE type_maps (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name varchar(50)
);

INSERT INTO type_maps (name) VALUES ('sample');

-- CREAMOS LOS MAPAS
DROP TABLE IF EXISTS maps;

CREATE TABLE maps (
	id INT AUTO_INCREMENT PRIMARY KEY,
	created TIMESTAMP DEFAULT NOW(),
	name varchar(50),
	type_id INT,
	FOREIGN KEY (type_id)
        REFERENCES type_maps(id)
        ON DELETE CASCADE
);

INSERT INTO maps (name, type_id) VALUES ('testmap1.json',1);
INSERT INTO maps (name, type_id) VALUES ('testmap2.json',1);

-- CREAMOS TABLA CON LOS TIPO DE CHARS QUE HABRA
DROP TABLE IF EXISTS type_chars;

CREATE TABLE type_chars(
	id INT AUTO_INCREMENT PRIMARY KEY,
	name varchar(100)
);

INSERT INTO type_chars (name) VALUES ('sample');

-- CREAMOS LOS PJ BASE
DROP TABLE IF EXISTS chars;

CREATE TABLE chars(
	id INT AUTO_INCREMENT PRIMARY KEY,
	name varchar(50),
	hp INT,
	attack INT,
	defense INT,
	speed INT,
	type_id INT,
	FOREIGN KEY (type_id)
        REFERENCES type_chars(id)
        ON DELETE CASCADE

);

INSERT INTO chars (name,hp,attack,defense,speed,type_id) VALUES ('Guerrero',70,8,5,5,1);
INSERT INTO chars (name,hp,attack,defense,speed,type_id) VALUES ('Caballero',90,5,8,3,1);
INSERT INTO chars (name,hp,attack,defense,speed,type_id) VALUES ('Asesino',40,9,3,9,1);


-- TABLA DE USUARIOS
DROP TABLE IF EXISTS users;

CREATE TABLE users (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name varchar(50),
	password varchar(300),
    pj varchar(20),
    created TIMESTAMP DEFAULT NOW(),
    admin boolean DEFAULT false,
    UNIQUE (name)
);

INSERT INTO users (name,password,admin) VALUES ('admin', SHA2('admin', 256), true);


-- TABLA D PJS POR USUARIO
DROP TABLE IF EXISTS users_chars;

CREATE TABLE users_chars (
	id INT AUTO_INCREMENT PRIMARY KEY,
	created TIMESTAMP DEFAULT NOW(),
	name varchar(50),
	map varchar(50),
	lvl INT,
	hp INT,
	attack INT,
	defense INT,
	speed INT,
	image varchar(50),
	weapon varchar(50),
	head varchar(50),
	xPos INT,
	yPos INT,
	action INT,
	direction INT,
	width INT,
	height INT,
	user_id INT,
	FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    UNIQUE (name)

);

INSERT INTO users_chars (name,lvl,hp,attack,defense,speed,user_id,image,weapon,head,xPos,yPos,direction,width,height,action) VALUES ("admin",100,1000,100,100,100,1,"armor.png","greatstaff.png","womenhead.png",7,7,1,128,128,0);
INSERT INTO users_chars (name,lvl,hp,attack,defense,speed,user_id,image,weapon,head,xPos,yPos,direction,width,height,action) VALUES ("Admin2",200,2000,200,200,200,1,"armor.png","greatstaff.png","womenhead.png",7,7,1,128,128,0);

DROP TABLE IF EXISTS inventories;


-- INVENTARIO DE CADA PJ
CREATE TABLE inventories(
	id INT AUTO_INCREMENT PRIMARY KEY,
	users_chars_id INT,
	FOREIGN KEY (users_chars_id)
        REFERENCES users_chars(id)
        ON DELETE CASCADE
);


DROP TABLE IF EXISTS tiles;


-- TILES DEL MAPA
CREATE TABLE tiles(
	id INT AUTO_INCREMENT PRIMARY KEY,
	name varchar(50)
);

INSERT INTO tiles (name) VALUES ('0 - Hierba');
INSERT INTO tiles (name) VALUES ('1 - Piedra');
INSERT INTO tiles (name) VALUES ('2 - Ladrillo');


-- SPRITES PARA LA PERSONALIZACION DEL PJ
-- DROP TABLE IF EXISTS sprites;

-- CREATE TABLE sprites(
-- 	id INT AUTO_INCREMENT PRIMARY KEY,

-- );


-- EQUIPAMIENTO
DROP TABLE IF EXISTS items;

CREATE TABLE items(
	id INT AUTO_INCREMENT PRIMARY KEY,
	name varchar(50),
	hp INT,
	attack INT,
	defense INT,
	speed INT
);

INSERT INTO items (name,hp,attack,defense,speed) VALUES ('Armadura tela',10,0,1,1);
INSERT INTO items (name,hp,attack,defense,speed) VALUES ('Armadura cuero',20,0,2,0);
INSERT INTO items (name,hp,attack,defense,speed) VALUES ('Armadura placas',30,0,3,-1);
INSERT INTO items (name,hp,attack,defense,speed) VALUES ('Daga',0,2,0,2);
INSERT INTO items (name,hp,attack,defense,speed) VALUES ('Espada',0,3,0,0);
INSERT INTO items (name,hp,attack,defense,speed) VALUES ('Mandoble',0,5,0,-1);
INSERT INTO items (name,hp,attack,defense,speed) VALUES ('Escudo',0,0,5,0);


-- UNION DE INVENTARIO DE PJS E ITEMS
DROP TABLE IF EXISTS inventories_characters;

CREATE TABLE inventories_characters(
	id INT AUTO_INCREMENT PRIMARY KEY,
	inventory_id INT,
	item_id INT,
	FOREIGN KEY (inventory_id)
        REFERENCES inventories(id)
        ON DELETE CASCADE,
	FOREIGN KEY (item_id)
        REFERENCES items(id)
        ON DELETE CASCADE
);