create database museovirtual;
use museovirtual;

create table museo(
    idMuseo INT NOT NULL AUTO_INCREMENT,
    nombreMuseo VARCHAR(255),
    idSalaInicial INT,
    nombreAudioFondo VARCHAR(255),
    activo BOOLEAN,
    PRIMARY KEY (idMuseo)
);

create table usuarioadmin (
    idAdmin INT NOT NULL AUTO_INCREMENT,
    correo VARCHAR(255),
    super BOOLEAN,
    UNIQUE (correo),
    PRIMARY KEY (idAdmin)
);

create table sala(
    idSala INT NOT NULL AUTO_INCREMENT,
    idMuseo INT NOT NULL,
    nombreImgFondo VARCHAR(255),
    rotacionInicial FLOAT,
    temaCuratorial VARCHAR(255),
    PRIMARY KEY (idSala),
    FOREIGN KEY (idMuseo) REFERENCES museo(idMuseo) ON DELETE CASCADE
);


create table obra(
    idObra INT NOT NULL AUTO_INCREMENT,
    idSala INT NOT NULL,
    asignatura VARCHAR(255),
    ciclo INT,
    autor VARCHAR(255),
    titulo VARCHAR(255),
    genero VARCHAR(255),
    facebook VARCHAR(255),
    instagram VARCHAR(255),
    proyectoWeb VARCHAR(255),
    dimensiones VARCHAR(255),
    fechaProduccion VARCHAR(255),
    tutor VARCHAR(255),
    descripcion TEXT,
    contador BIGINT,
    imagenes TEXT,
    linkVideoYoutube VARCHAR(255),
    obj VARCHAR(255),
    posX FLOAT,
    posY FLOAT,
    posZ FLOAT,
    tecnica VARCHAR(255),
    PRIMARY KEY (idObra),
    FOREIGN KEY (idSala) REFERENCES sala(idSala) ON DELETE CASCADE
);


create table usuario(
    idUsuario VARCHAR(255) NOT NULL,
    identificador VARCHAR(255) NOT NULL,
    nombreUsuario VARCHAR(255),
    linkFoto VARCHAR(255),
    email VARCHAR(255),
    PRIMARY KEY (idUsuario) 
);


create table comentario(
    idComentario BIGINT NOT NULL AUTO_INCREMENT,
    idUsuario VARCHAR(255) NOT NULL,
    idObra INT NOT NULL,
    contenido TEXT,
    fecha VARCHAR(255),
    PRIMARY KEY (idComentario),
    FOREIGN KEY (idObra) REFERENCES obra(idObra) ON DELETE CASCADE,
    FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario) ON DELETE CASCADE
);


create table enlace(
    idEnlace INT NOT NULL AUTO_INCREMENT,
    idSala INT NOT NULL,
    idSalaDestino INT NOT NULL,
    posXIcono FLOAT,
    posYIcono FLOAT,
    posZIcono FLOAT,
    PRIMARY KEY (idEnlace),
    FOREIGN KEY (idSala) REFERENCES sala(idSala) ON DELETE CASCADE,
    FOREIGN KEY (idSalaDestino) REFERENCES sala(idSala) ON DELETE CASCADE
);

ALTER TABLE `museo` ADD INDEX `activo` (`activo`) USING BTREE;
ALTER TABLE `usuarioadmin` ADD INDEX `super` (`super`) USING BTREE;
ALTER TABLE `usuario` ADD INDEX `identificador` (`identificador`) USING BTREE;

DELIMITER //
CREATE TRIGGER `eliminarSala` AFTER DELETE ON `sala`
    FOR EACH ROW BEGIN
DECLARE x int;
    SELECT `idSalaInicial` INTO x from `museo` where `idMuseo` = OLD.idMuseo;
    if x = OLD.idSala
    THEN
	    UPDATE museo set idSalaInicial = null WHERE idMuseo = OLD.idMuseo;
    END IF;
END
//

DELIMITER //
CREATE TRIGGER `insertarSala` AFTER INSERT ON `sala`
 FOR EACH ROW BEGIN
DECLARE x int;
    SELECT idSalaInicial INTO x from museo where museo.idMuseo = NEW.idMuseo;
    if x <=> NULL
    	THEN
	    	UPDATE museo set idSalaInicial = NEW.idSala WHERE museo.idMuseo = NEW.idMuseo;
    END IF;
END
//
