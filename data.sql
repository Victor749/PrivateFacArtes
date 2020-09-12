




INSERT INTO `museo` (`idMuseo`, `nombreMuseo`, `idSalaInicial`, `nombreAudioFondo`, `activo`) VALUES (1, 'Museo 1', '1', 'ambient.wav', '1');
INSERT INTO `usuarioadmin` (`correo`, `super`) VALUES ('facartes.mvuc@gmail.com', '1');

INSERT INTO `sala` (`idSala`, `idMuseo`, `nombreImgFondo`, `rotacionInicial`, `temaCuratorial`) VALUES ('1', '1', '360_1 - Panorama.jpg', '0', 'Sala 1');
INSERT INTO `sala` (`idSala`, `idMuseo`, `nombreImgFondo`, `rotacionInicial`, `temaCuratorial`) VALUES ('2', '1', '360_2 - Panorama.jpg', '0', 'Sala 2');
INSERT INTO `sala` (`idSala`, `idMuseo`, `nombreImgFondo`, `rotacionInicial`, `temaCuratorial`) VALUES ('3', '1', '360_3 - Panorama.jpg', '0', 'Sala 3');
INSERT INTO `sala` (`idSala`, `idMuseo`, `nombreImgFondo`, `rotacionInicial`, `temaCuratorial`) VALUES ('4', '1', '360_4 - Panorama.jpg', '0', 'Sala 4');
INSERT INTO `sala` (`idSala`, `idMuseo`, `nombreImgFondo`, `rotacionInicial`, `temaCuratorial`) VALUES ('5', '1', '360_5 - Panorama.jpg', '0', 'Sala 5');
INSERT INTO `sala` (`idSala`, `idMuseo`, `nombreImgFondo`, `rotacionInicial`, `temaCuratorial`) VALUES ('6', '1', '360_6 - Panorama.jpg', '0', 'Sala 6');
INSERT INTO `sala` (`idSala`, `idMuseo`, `nombreImgFondo`, `rotacionInicial`, `temaCuratorial`) VALUES ('7', '1', '360_7 - Panorama.jpg', '0', 'Sala 7');
INSERT INTO `sala` (`idSala`, `idMuseo`, `nombreImgFondo`, `rotacionInicial`, `temaCuratorial`) VALUES ('8', '1', '360_8 - Panorama.jpg', '0', 'Sala 8');

INSERT INTO `enlace` (`idEnlace`, `idSala`, `idSalaDestino`, `posXIcono`, `posYIcono`, `posZIcono`) VALUES (NULL, 1, 2, '-20', '0', '0');
INSERT INTO `enlace` (`idEnlace`, `idSala`, `idSalaDestino`, `posXIcono`, `posYIcono`, `posZIcono`) VALUES (NULL, 2, 1, '-15', '80', '0');
INSERT INTO `enlace` (`idEnlace`, `idSala`, `idSalaDestino`, `posXIcono`, `posYIcono`, `posZIcono`) VALUES (NULL, 2, 2, '-11', '-10', '-9');
INSERT INTO `enlace` (`idEnlace`, `idSala`, `idSalaDestino`, `posXIcono`, `posYIcono`, `posZIcono`) VALUES (NULL, 3, 2, '-11', '148', '7');
INSERT INTO `enlace` (`idEnlace`, `idSala`, `idSalaDestino`, `posXIcono`, `posYIcono`, `posZIcono`) VALUES (NULL, 4, 4, '-4', '-119', '90');
INSERT INTO `enlace` (`idEnlace`, `idSala`, `idSalaDestino`, `posXIcono`, `posYIcono`, `posZIcono`) VALUES (NULL, 5, 3, '-4', '-110', '-90');

INSERT INTO `obra` (`idObra`, `idSala`, `asignatura`, `ciclo`, `autor`, `titulo`, `genero`, `facebook`, `instagram`, `proyectoWeb`, `dimensiones`, `fechaProduccion`, `tutor`, `descripcion`, `contador`, `imagenes`, `posX`, `posY`, `posZ`, `tecnica`) VALUES (NULL, 3, 'Asignatura 1', '1', 'Autor 1', 'Titulo 1', 'Género 1', 'https://es-la.facebook.com/', 'https://www.instagram.com/?hl=es-la', 'https://www.google.com/', '50 x 50 cm', '12/09/2020', 'Tutor 1', 'Descripción 1.', '0', 'Escultura 1.jpg', '-12', '49', '-9', 'Técnica 1');
INSERT INTO `obra` (`idObra`, `idSala`, `asignatura`, `ciclo`, `autor`, `titulo`, `genero`, `facebook`, `instagram`, `proyectoWeb`, `dimensiones`, `fechaProduccion`, `tutor`, `descripcion`, `contador`, `imagenes`, `posX`, `posY`, `posZ`, `tecnica`) VALUES (NULL, 3, 'Asignatura 2', '2', 'Autor 2', 'Titulo 2', 'Género 2', 'https://es-la.facebook.com/', 'https://www.instagram.com/?hl=es-la', 'https://www.google.com/', '50 x 50 cm', '12/09/2020', 'Tutor 2', 'Descripción 2.', '0', 'Escultura 2.jpg', '-18', '16', '-7', 'Técnica 2');
INSERT INTO `obra` (`idObra`, `idSala`, `asignatura`, `ciclo`, `autor`, `titulo`, `genero`, `facebook`, `instagram`, `proyectoWeb`, `dimensiones`, `fechaProduccion`, `tutor`, `descripcion`, `contador`, `imagenes`, `posX`, `posY`, `posZ`, `tecnica`) VALUES (NULL, 3, 'Asignatura 3', '3', 'Autor 3', 'Titulo 3', 'Género 3', 'https://es-la.facebook.com/', 'https://www.instagram.com/?hl=es-la', 'https://www.google.com/', '50 x 50 cm', '12/09/2020', 'Tutor 3', 'Descripción 3.', '0', 'Escultura 3.jpg', '-10.5', '78.5', '0', 'Técnica 3');
INSERT INTO `obra` (`idObra`, `idSala`, `asignatura`, `ciclo`, `autor`, `titulo`, `genero`, `facebook`, `instagram`, `proyectoWeb`, `dimensiones`, `fechaProduccion`, `tutor`, `descripcion`, `contador`, `imagenes`, `posX`, `posY`, `posZ`, `tecnica`) VALUES (NULL, 3, 'Asignatura 5', '5', 'Autor 5', 'Titulo 5', 'Género 5', 'https://es-la.facebook.com/', 'https://www.instagram.com/?hl=es-la', 'https://www.google.com/', '50 x 50 cm', '12/09/2020', 'Tutor 5', 'Descripción 5.', '0', 'Escultura 5.jpg', '-17.5', '-31', '7', 'Técnica 5');
INSERT INTO `obra` (`idObra`, `idSala`, `asignatura`, `ciclo`, `autor`, `titulo`, `genero`, `facebook`, `instagram`, `proyectoWeb`, `dimensiones`, `fechaProduccion`, `tutor`, `descripcion`, `contador`, `imagenes`, `posX`, `posY`, `posZ`, `tecnica`) VALUES (NULL, 1, 'Asignatura 0', '1', 'Autor 0', 'Obra 0', 'Genero 0', 'https://es-la.facebook.com/', 'https://www.instagram.com/?hl=es-la', 'https://www.google.com/', '23 x 34 cm', '12/09/23', 'Tutor 0', 'Obra 0.', '0', 'Escultura 1.jpg;Escultura 2.jpg;Escultura 3.jpg;Escultura 4.jpg;Escultura 5.jpg', '-24', '7', '0', 'Escultura');
