
var museos = [];
var museoSeleccionado ;
var salas = [];
var salaSeleccionada ;
var obras = [];
var obraSeleccionada ;
var actual = 0;
var limit = 5;

$(document).ready(function () {
    getMuseos();
    $('#btnCargar').hide();
    $('#mensajeError1').hide();
    $('#mensajeError2').hide();
    $('#museos').change(function () {
        posicion = $("#museos option:selected").attr('value');
        goMuseoEspecifico(posicion);
    });

    $('#salas').change(function () {
        posicion = $("#salas option:selected").attr('value');
        goSalaEspecifica(posicion);
    });

    $('#obras').change(function () {
        posicion = $("#obras option:selected").attr('value');
        obraSeleccionada = obras[posicion];
    });
});

function cleanOldStuff(id){
    element = document.getElementById(id);
    while(element.hasChildNodes()){
        element.removeChild(element.firstChild);
    }
}

function getMuseos(){
    cleanOldStuff('museos');
    var url  = "http://localhost:3000/crudMuseo/getMuseos";
    var xhr  = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.onload = function () {
        var respuesta = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            museos = respuesta;
            for(var i=0;i<museos.length;i++){
                info = '<option class="dropdown-item" href="#" value='+i+'>'+museos[i].nombreMuseo+'</option>';
                $('#museos').append(info);
            }
            if(museos.length > 0){
                goMuseoEspecifico(0);
            }
        }else if(xhr.status == '401'){
            $("#modal-sesion").modal();
            $('#modal-sesion').on('hidden.bs.modal', function () {
                window.location.replace("/editor");
            });
        } else {
            console.error(respuesta);
        }
    }
    xhr.send(null);
}

function goMuseoEspecifico(posicion){
    museoSeleccionado = museos[posicion];
    cleanOldStuff('salas');
    var url  = "http://localhost:3000/salas/api/getSalas/"+museoSeleccionado.idMuseo;
    var xhr  = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.onload = function () {
        var respuesta = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            salas = respuesta;
            for(var i=0;i<respuesta.length;i++){
                info = '<option value='+i+'>Sala '+(i+1)+': '+respuesta[i].temaCuratorial+'</option>';
                $('#salas').append(info);
            }
            if(salas.length > 0){
                goSalaEspecifica(0);
            }
        } else {
            console.error(respuesta);
        }
    }
    xhr.send(null);
}

function goSalaEspecifica(posicion){
    salaSeleccionada = salas[posicion];
    cleanOldStuff('obras');
    var url  = "http://localhost:3000/obras/api/getObras/"+salaSeleccionada.idSala;
    var xhr  = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.onload = function () {
        var respuesta = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            obras = respuesta;
            for(var i=0;i<respuesta.length;i++){
                info = '<option value='+i+'>Obra '+(i+1)+': '+respuesta[i].titulo+'</option>';
                $('#obras').append(info);
            }
            if(obras.length > 0){
                obraSeleccionada = obras[0];
            }
        } else {
            console.error(respuesta);
        }
    }
    xhr.send(null);
}

function buscarComentarios(){
    if(museos.length > 0 && salas.length > 0 && obras.length > 0){
        actual = 0;
        cleanOldStuff('listaComentarios');
        $('#mensajeError1').hide();
        $('#mensajeError2').hide();
        cargarC();
    }else{
        $('#btnCargar').hide();
        $('#mensajeError1').show();
        $('#mensajeError2').hide();
    }
    return false;
}

function cargarC(){
    idObra = obraSeleccionada.idObra;
    var url  = "http://localhost:3000/editorComentarios/getComentarios/"+idObra+'/'+actual+'/'+limit;
    var xhr  = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.onload = function () {
        var data = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            for(var i=0;i<data.length;i++){
                info = '<tr class="'+data[i].idComentario+'"><td>'+'<div class="row justify-content-center mb-5" >'+
                            '<div class="col col-sm-1 mr-5"><img src="'+data[i].linkFoto+'" height=60 width=60></div>'+
                            '<div class="col col-sm-9"><div class="row align-items-left ml-2" ><b style="color:black;">'+data[i].nombreUsuario+'</b></div>'+
                            '<div class="row align-items-left ml-3 mb-2" ><p class="text-muted">'+data[i].fecha+'</p></div>'+
                            '<div class="row align-items-left ml-2 text-justify" ><p>'+data[i].contenido+'</p></div>'+
                            '</td><td><div class="row align-items-right" ><button onclick="eliminar('+data[i].idComentario+')" class="btn btn-danger">Eliminar</button></div>'+
                            '</div></div></td></tr>';
                $('#listaComentarios').append(info);
                
            }
            $('#tabla').animate({ scrollTop: $('#tabla').prop("scrollHeight")}, 1000); 
            if(actual == 0 && data.length == 0){
                $('#btnCargar').hide();
                $('#mensajeError1').show();
                $('#mensajeError2').hide();

            }else if(data.length == 0){
                $('#btnCargar').hide();
                $('#mensajeError2').show();
                $('#mensajeError1').hide();
            }else{
                $('#btnCargar').show();
                actual+=limit;
            }
            
        }else if(xhr.status == '401'){
            $("#modal-sesion").modal();
            $('#modal-sesion').on('hidden.bs.modal', function () {
                window.location.replace("/editor");
            });
        } else {
            console.error(data);
            alert('Ha ocurrido un error. Intentelo mas tarde.');
        }
    }
    xhr.send(null);
    return false;
}

function eliminar(idComentario){
    console.log(idComentario);
    var url = "http://localhost:3000/editorComentarios/deleteComentario/"+idComentario;
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", url, true);
    xhr.onload = function () {
        var users = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
           $('.'+idComentario).remove();
        } else if(xhr.status == '401'){
            $("#modal-sesion").modal();
            $('#modal-sesion').on('hidden.bs.modal', function () {
                window.location.replace("/editor");
            });
        }else {
            console.error(users);
        }
    }
    xhr.send(null);
}

