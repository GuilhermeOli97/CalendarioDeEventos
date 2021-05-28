DROP DATABASE IF exists eventos;
CREATE DATABASE IF NOT EXISTS eventos;
USE eventos;
CREATE TABLE IF NOT EXISTS usuarios(
  usuario varchar(15) not null,
  senha varchar(255) not null,
);

CREATE TABLE IF NOT EXISTS evento(
  id int NOT NULL AUTO_INCREMENT,
  descricao varchar(255) not null,
  inicio date-time,
  termino date-time, 
  PRIMARY KEY (id)
);