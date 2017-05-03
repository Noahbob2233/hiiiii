DROP DATABASE IF EXISTS warbo;

CREATE DATABASE warbo;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
	name varchar(50),
	password varchar(50),
    admin boolean
);

INSERT INTO users VALUES ('admin', 'admin', true);
INSERT INTO users VALUES ('test', 'test', false);