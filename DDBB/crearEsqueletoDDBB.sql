DROP DATABASE IF EXISTS warbo;

CREATE DATABASE warbo;

USE warbo;

DROP TABLE IF EXISTS maps;

CREATE TABLE maps (
	id INT AUTO_INCREMENT PRIMARY KEY,
	created TIMESTAMP DEFAULT NOW(),
	name varchar(50)
);

INSERT INTO maps (name) VALUES ('sample1.json');
INSERT INTO maps (name) VALUES ('sample2.json');
INSERT INTO maps (name) VALUES ('sample3.json');

DROP TABLE IF EXISTS chars;

CREATE TABLE chars(
	id INT AUTO_INCREMENT PRIMARY KEY,
	name varchar(50),
	hp INT,
	attack INT,
	defense INT,
	speed INT
);

INSERT INTO chars (name,hp,attack,defense,speed) VALUES ('Guerrero',70,8,5,5);
INSERT INTO chars (name,hp,attack,defense,speed) VALUES ('Caballero',90,5,8,3);
INSERT INTO chars (name,hp,attack,defense,speed) VALUES ('Asesino',40,9,3,9);

DROP TABLE IF EXISTS users;

CREATE TABLE users (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name varchar(50),
	password varchar(300),
    pj varchar(20),
    created TIMESTAMP DEFAULT NOW(),
    admin boolean
);

INSERT INTO users (name,password,admin) VALUES ('admin', SHA2('admin', 256), true);
INSERT INTO users (name,password,admin) VALUES ('test', SHA2('test', 256), true);

DROP TABLE IF EXISTS users_chars;

CREATE TABLE users_chars (
	id INT AUTO_INCREMENT PRIMARY KEY,
	created TIMESTAMP DEFAULT NOW(),
	name varchar(50),
	map varchar(50),
	user_id INT,
	FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE 

);

DROP TABLE IF EXISTS tiles;

CREATE TABLE tiles(
	id INT AUTO_INCREMENT PRIMARY KEY,
	name varchar(50)
);

INSERT INTO tiles (name) VALUES ('0 - Hierba');
INSERT INTO tiles (name) VALUES ('1 - Piedra');
INSERT INTO tiles (name) VALUES ('2 - Ladrillo');

-- DROP TABLE IF EXISTS sprites;

-- CREATE TABLE sprites(
-- 	id INT AUTO_INCREMENT PRIMARY KEY,

-- );

DROP TABLE IF EXISTS gear;

CREATE TABLE gear(
	id INT AUTO_INCREMENT PRIMARY KEY,
	name varchar(50),
	hp INT,
	attack INT,
	defense INT,
	speed INT
);

INSERT INTO gear (name,hp,attack,defense,speed) VALUES ('Armadura tela',10,0,1,1);
INSERT INTO gear (name,hp,attack,defense,speed) VALUES ('Armadura cuero',20,0,2,0);
INSERT INTO gear (name,hp,attack,defense,speed) VALUES ('Armadura placas',30,0,3,-1);
INSERT INTO gear (name,hp,attack,defense,speed) VALUES ('Daga',0,2,0,2);
INSERT INTO gear (name,hp,attack,defense,speed) VALUES ('Espada',0,3,0,0);
INSERT INTO gear (name,hp,attack,defense,speed) VALUES ('Mandoble',0,5,0,-1);
INSERT INTO gear (name,hp,attack,defense,speed) VALUES ('Escudo',0,0,5,0);
