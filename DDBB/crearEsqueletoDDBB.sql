DROP DATABASE IF EXISTS warbo;

CREATE DATABASE warbo;

USE warbo;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
	name varchar(50),
	password varchar(256),
    admin boolean
);

INSERT INTO users VALUES ('admin', SHA2('admin', 256), true);
INSERT INTO users VALUES ('test', SHA2('test', 256), false);
