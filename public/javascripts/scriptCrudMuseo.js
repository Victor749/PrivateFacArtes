
var museoSeleccionado = null;
var museos = [];
var vistoBuenoNuevo = false;



$(document).ready(function () {
    $('#editorMuseo').hide();
    $('#editorEnlaces').hide();
    $('#editorSalas').hide();
    $('#mensajeError1').hide();
    $('#mensajeError2').hide();
    $('#mensajeError3').hide();
    $('#mensajeError4').hide();
    museoSeleccionado = null;
    showMuseosAntiguos();
    $('#btnNuevoMuseo').click(function (){
        museoSeleccionado = "nuevo";
        cleanOldInfoMuseo();
        $('#editorMuseo').show();
        $('#editorEnlaces').hide();
        $('#editorSalas').hide();
        $('#mensajeError1').hide();
        $('#mensajeError2').hide();
        $('#mensajeError3').hide();
        $('#mensajeError4').hide();
    });
    
});

function showData(id){
    switch(museoSeleccionado){
        case null:
            $('#editorMuseo').hide();
            $('#editorEnlaces').hide();
            $('#editorSalas').hide();
            $('#mensajeError1').show();
            $('#mensajeError2').hide();
            $('#mensajeError3').hide();
            $('#mensajeError4').hide();
            break;
        case 'nuevo':
            if(vistoBuenoNuevo){
                showAllData(id);
            }else{
                $('#mensajeError1').hide();
                $('#mensajeError4').hide();
                if(id == '#editorEnlaces'){
                    $('#mensajeError2').show();
                }else{
                    $('#mensajeError3').show();
                }
            }
            break;
        default:
            showAllData(id);
            break;
    }
    return false;
}

function showAllData(id){
    $('#mensajeError1').hide();
    $('#mensajeError2').hide();
    $('#mensajeError3').hide();
    $('#mensajeError4').hide();
    if($(id). is(":hidden")){
        $(id).show();
    }else{
        $(id).hide();
    }
   
}

function showMuseosAntiguos(){
    var url  = "http://localhost:3000/museo/api/getMuseos";
    var xhr  = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.onload = function () {
        var respuesta = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            museos = respuesta;
            for(var i=0;i<museos.length;i++){
                info = '<a class="dropdown-item" href="#" onclick="return goMuseoEspecifico('+i+')">'+museos[i].nombreMuseo+'</a>';
                $('#grupoMuseos').append(info);
            }
        } else {
            console.error(respuesta);
        }
    }
    xhr.send(null);
}

function goMuseoEspecifico(posicion){
    console.log(museos[posicion]);
    museoSeleccionado = museos[posicion];
    $('#btnDangerMuseo').html('Eliminar');
    $('#editorMuseo').show();
    $('#mensajeError1').hide();
    $('#mensajeError2').hide();
    $('#mensajeError3').hide();
    $('#mensajeError4').hide();
    $('#nombreMuseo').val(museoSeleccionado.nombreMuseo);
    $('#nombreMuseo').attr('idMuseo', museoSeleccionado.idMuseo);
    if(museoSeleccionado.activo == 1){
        $('#estadoMuseo option:eq(0)').prop('selected', true);
        $('#estadoMuseo').prop('disabled', 'disabled');
    }else{
        $('#estadoMuseo option:eq(1)').prop('selected', true);
        $('#estadoMuseo').prop('disabled', false);
    }
    extraerSalas(museoSeleccionado.idMuseo); 
    $("#myfileAudio").val("");
    $('#audioActual').val(museoSeleccionado.nombreAudioFondo);
    return false;
}

function extraerSalas(idMuseo){
    cleanOldStuff('primeraSala');
    var url  = "http://localhost:3000/salas/api/getSalas/"+idMuseo;
    var xhr  = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.onload = function () {
        var respuesta = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            for(var i=0;i<respuesta.length;i++){
                info = '<option value='+respuesta[i].idSala+'>Sala '+(i+1)+': '+respuesta[i].temaCuratorial+'</option>';
                $('#primeraSala').append(info);
            }
            $('#primeraSala option[value='+ museoSeleccionado.idSalaInicial +']').attr("selected",true);
        } else {
            console.error(respuesta);
        }
    }
    xhr.send(null);
}

function cleanOldStuff(id){
    element = document.getElementById(id);
    while(element.hasChildNodes()){
        element.removeChild(element.firstChild);
    }
}

function cleanOldInfoMuseo(){
    $('#btnDangerMuseo').html('Cancelar');
    $('#nombreMuseo').val("");
    $('#estadoMuseo option:eq(1)').prop('selected', true);
    $('#estadoMuseo').prop('disabled', false);
    $('#audioActual').val("");
    $("#myfileAudio").val("");
    cleanOldStuff('primeraSala');
}



function validateMuseoInfo(){
    if($('#nombreMuseo').val() == '' || (museoSeleccionado == 'nuevo' && $('#myfileAudio')[0].files.length==0)){
        $('#mensajeError4').show();
        return false;
    }else{
        $('#mensajeError4').hide();
        return true;
    }
}

function saveInfoMuseo(){
    if(validateMuseoInfo()){
        console.log(document.getElementById('myfileAudio').files[0]);
        var data = new FormData();
        data.append('fileAudio', $('#myfileAudio')[0].files[0]);
        data.append('nombreMuseo', $('#nombreMuseo').val());
        data.append('audioActual', $('#audioActual').val());
        if($('#primeraSala').children().length>0){
            data.append('primeraSala', $("#primeraSala option:selected").attr('value'));
        }else{
            data.append('primeraSala', -1); 
        }
        if(museoSeleccionado == 'nuevo'){
            data.append('idMuseo', -1); 
        }else{
            data.append('idMuseo', $('#nombreMuseo').attr('idMuseo')); 
        }
        for (var pair of data.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
        }
        fetch('http://localhost:3000/crudMuseo/addNewAudio', {
            method: 'POST',
           /* headers:{
                'Content-Type': 'multipart/form-data',
                'processData': false,
              },*/
            body: data,
        });
       
    }
    return false;
}