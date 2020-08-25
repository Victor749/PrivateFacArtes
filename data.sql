INSERT INTO `museo` (`idMuseo`, `nombreMuseo`, `idSalaInicial`, `nombreAudioFondo`, `nombreIconoInfo`, `nombreIconoNext`, `activo`) VALUES (NULL, 'Museo 1', '1', 'ambient.wav', 'info_icon.png', 'nav_icon.png', '1');

INSERT INTO `sala` (`idSala`, `idMuseo`, `nombreImgFondo`, `rotacionInicial`, `temaCuratorial`) VALUES (NULL, '1', '360_1 - Panorama.jpg', '0', 'Sala 1');
INSERT INTO `sala` (`idSala`, `idMuseo`, `nombreImgFondo`, `rotacionInicial`, `temaCuratorial`) VALUES (NULL, '1', '360_2 - Panorama.jpg', '0', 'Sala 2');
INSERT INTO `sala` (`idSala`, `idMuseo`, `nombreImgFondo`, `rotacionInicial`, `temaCuratorial`) VALUES (NULL, '1', '360_3 - Panorama.jpg', '0', 'Sala 3');
INSERT INTO `sala` (`idSala`, `idMuseo`, `nombreImgFondo`, `rotacionInicial`, `temaCuratorial`) VALUES (NULL, '1', '360_4 - Panorama.jpg', '0', 'Sala 4');
INSERT INTO `sala` (`idSala`, `idMuseo`, `nombreImgFondo`, `rotacionInicial`, `temaCuratorial`) VALUES (NULL, '1', '360_5 - Panorama.jpg', '0', 'Sala 5');
INSERT INTO `sala` (`idSala`, `idMuseo`, `nombreImgFondo`, `rotacionInicial`, `temaCuratorial`) VALUES (NULL, '1', '360_6 - Panorama.jpg', '0', 'Sala 6');
INSERT INTO `sala` (`idSala`, `idMuseo`, `nombreImgFondo`, `rotacionInicial`, `temaCuratorial`) VALUES (NULL, '1', '360_7 - Panorama.jpg', '0', 'Sala 7');
INSERT INTO `sala` (`idSala`, `idMuseo`, `nombreImgFondo`, `rotacionInicial`, `temaCuratorial`) VALUES (NULL, '1', '360_8 - Panorama.jpg', '0', 'Sala 8');

INSERT INTO `enlace` (`idEnlace`, `idSala`, `idSalaDestino`, `posXIcono`, `posYIcono`) VALUES (NULL, '1', '2', '0', '0');
INSERT INTO `enlace` (`idEnlace`, `idSala`, `idSalaDestino`, `posXIcono`, `posYIcono`) VALUES (NULL, '2', '1', '0', '80');
INSERT INTO `enlace` (`idEnlace`, `idSala`, `idSalaDestino`, `posXIcono`, `posYIcono`) VALUES (NULL, '2', '3', '0', '-10');
INSERT INTO `enlace` (`idEnlace`, `idSala`, `idSalaDestino`, `posXIcono`, `posYIcono`) VALUES (NULL, '3', '2', '0', '147');
INSERT INTO `enlace` (`idEnlace`, `idSala`, `idSalaDestino`, `posXIcono`, `posYIcono`) VALUES (NULL, '3', '5', '0', '-120');
INSERT INTO `enlace` (`idEnlace`, `idSala`, `idSalaDestino`, `posXIcono`, `posYIcono`) VALUES (NULL, '5', '3', '0', '-110');

INSERT INTO `obra` (`idObra`, `idSala`, `asignatura`, `ciclo`, `autor`, `titulo`, `genero`, `facebook`, `instagram`, `proyectoWeb`, `dimensiones`, `fechaProduccion`, `tutor`, `descripcion`, `contador`, `tipo`, `nombreElemento`, `posX`, `posY`, `nombreAudio`, `tecnica`) VALUES (NULL, '3', 'Asignatura 1', '1', 'Autor 1', 'Titulo 1', 'Género 1', 'https://es-la.facebook.com/', 'https://www.instagram.com/?hl=es-la', 'https://www.google.com/', '50 x 50 cm', '12/09/2020', 'Tutor 1', 'Descripción 1.', '0', 'imagen', 'Escultura 1.jpg', '-7', '45', NULL, 'Técnica 1');
INSERT INTO `obra` (`idObra`, `idSala`, `asignatura`, `ciclo`, `autor`, `titulo`, `genero`, `facebook`, `instagram`, `proyectoWeb`, `dimensiones`, `fechaProduccion`, `tutor`, `descripcion`, `contador`, `tipo`, `nombreElemento`, `posX`, `posY`, `nombreAudio`, `tecnica`) VALUES (NULL, '3', 'Asignatura 2', '2', 'Autor 2', 'Titulo 2', 'Género 2', 'https://es-la.facebook.com/', 'https://www.instagram.com/?hl=es-la', 'https://www.google.com/', '50 x 50 cm', '12/09/2020', 'Tutor 2', 'Descripción 2.', '0', 'imagen', 'Escultura 2.jpg', '-10', '12', NULL, 'Técnica 2');
INSERT INTO `obra` (`idObra`, `idSala`, `asignatura`, `ciclo`, `autor`, `titulo`, `genero`, `facebook`, `instagram`, `proyectoWeb`, `dimensiones`, `fechaProduccion`, `tutor`, `descripcion`, `contador`, `tipo`, `nombreElemento`, `posX`, `posY`, `nombreAudio`, `tecnica`) VALUES (NULL, '3', 'Asignatura 3', '3', 'Autor 3', 'Titulo 3', 'Género 3', 'https://es-la.facebook.com/', 'https://www.instagram.com/?hl=es-la', 'https://www.google.com/', '50 x 50 cm', '12/09/2020', 'Tutor 3', 'Descripción 3.', '0', 'imagen', 'Escultura 3.jpg', '-5', '75', NULL, 'Técnica 3');
INSERT INTO `obra` (`idObra`, `idSala`, `asignatura`, `ciclo`, `autor`, `titulo`, `genero`, `facebook`, `instagram`, `proyectoWeb`, `dimensiones`, `fechaProduccion`, `tutor`, `descripcion`, `contador`, `tipo`, `nombreElemento`, `posX`, `posY`, `nombreAudio`, `tecnica`) VALUES (NULL, '3', 'Asignatura 5', '5', 'Autor 5', 'Titulo 5', 'Género 5', 'https://es-la.facebook.com/', 'https://www.instagram.com/?hl=es-la', 'https://www.google.com/', '50 x 50 cm', '12/09/2020', 'Tutor 5', 'Descripción 5.', '0', 'imagen', 'Escultura 5.jpg', '-10', '-35.4', NULL, 'Técnica 5');

