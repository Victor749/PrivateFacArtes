
var museoSeleccionado = 'nuevo';
var museos = [];
var vistoBuenoNuevo = false;



$(document).ready(function () {
    $('#btnNuevoMuseo').click(function (){
        museoSeleccionado = "nuevo";
        cleanOldInfoMuseo();
        $('#mensajeError4').hide();
        $('#mensajeError5').hide();
        $('#mensajeError6').hide();
        $('#mensajeBien1').hide();
    });
    showMuseosAntiguos();
    $('#btnNuevoMuseo').trigger('click');
    
});

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
    $('#mensajeError4').hide();
    $('#mensajeError5').hide();
    $('#mensajeError6').hide();
    $('#mensajeBien1').hide();
    $('#nombreMuseo').val(museoSeleccionado.nombreMuseo);
    $('#nombreMuseo').attr('idMuseo', museoSeleccionado.idMuseo);
    if(museoSeleccionado.activo == 1){
        $('#estadoMuseo option:eq(0)').prop('selected', true);
        $('#estadoMuseo').prop('disabled', 'disabled');
    }else{
        $('#estadoMuseo option:eq(1)').prop('selected', true);
        $('#estadoMuseo').prop('disabled', false);
    }
    $("#myfileAudio").val("");
    $('#audioActual').val(museoSeleccionado.nombreAudioFondo);
    return false;
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
}


function validateMuseoInfo(){
    if($('#nombreMuseo').val() == '' || (museoSeleccionado == 'nuevo' && $('#myfileAudio')[0].files.length==0)){
        $('#mensajeError4').show();
        $('#mensajeError5').hide();
        
        return false;
    }else{
        $('#mensajeError4').hide();
        return validateNameMuseo();
        
    }
}

function validateNameMuseo(){
    var newName = $('#nombreMuseo').val();
    if(museoSeleccionado == 'nuevo'){
        for(var i=0;i<museos.length;i++){

            if(newName == museos[i].nombreMuseo){
                $('#mensajeError5').show();
                return false;
            }
        }
    }else{
        for(var i=0;i<museos.length;i++){
            if(museos[i].nombreMuseo != museoSeleccionado.nombreMuseo){
                if(newName == museos[i].nombreMuseo){
                    $('#mensajeError5').show();
                    return false;
                }
            }   
        }
    }
    $('#mensajeError5').hide();
    return true;
}

function saveInfoMuseo(){
    $('#mensajeError6').hide();
    if(validateMuseoInfo()){
        //console.log(document.getElementById('myfileAudio').files[0]);
        var data = new FormData();
        if($('#myfileAudio')[0].files.length>0){
            data.append($('#nombreMuseo').val()+'-'+$('#myfileAudio')[0].files[0].name, $('#myfileAudio')[0].files[0]);
            data.append('nombreArchivo', $('#nombreMuseo').val()+'-'+$('#myfileAudio')[0].files[0].name);
            data.append('estadoArchivo', 'nuevo');
        }else{
            if($('#nombreMuseo').val() != museoSeleccionado.nombreMuseo){
                nombreAudio = $('#audioActual').val().split('-');
                nuevoAudio = $('#nombreMuseo').val()+'-';
                for(var i=1;i<nombreAudio.length;i++){
                    nuevoAudio+=nombreAudio[i];
                }
                data.append('nombreArchivo', nuevoAudio);
                data.append('estadoArchivo', 'viejo');
            }else{
                data.append('nombreArchivo', $('#audioActual').val());
            }
        }
        
        data.append('nombreMuseo', $('#nombreMuseo').val());
        data.append('audioActual', $('#audioActual').val());
        
        if(museoSeleccionado == 'nuevo'){
            data.append('idMuseo', -1); 
        }else{
            data.append('idMuseo', $('#nombreMuseo').attr('idMuseo')); 
        }
        
        data.append('activo', $("#estadoMuseo option:selected").attr('value'));

        for (var pair of data.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
        }

        //$('#audioActual2').val(data.);
        
        var xhr = new XMLHttpRequest();
        xhr.open("POST", 'http://localhost:3000/crudMuseo/setMuseoInfo', true);
        xhr.onload = function () {
            if (xhr.readyState == 4 && xhr.status == "200") {
                $('#audioActual').val(data.get('nombreArchivo'));
                $("#myfileAudio").val("");
                if($("#estadoMuseo option:selected").attr('value') == 1){
                    $('#estadoMuseo').prop('disabled', 'disabled');
                }
                cleanOldStuff('grupoMuseos');
                showMuseosAntiguos();
                $('#mensajeBien1').show();
            } else {
                alert('Ha ocurrido un error. Intentelo mas tarde.');
            }
        }
        xhr.send(data);
       
       
    }
    return false;
}

function accionDangerMuseo(){
    if(museoSeleccionado == 'nuevo'){
        cleanOldInfoMuseo();
    }else if($("#estadoMuseo option:selected").attr('value') == 1){
        $('#mensajeError6').show();
    }else{
        var url = "http://localhost:3000/museo/deleteMuseo/"+museoSeleccionado.idMuseo;
        var xhr = new XMLHttpRequest();
        xhr.open("DELETE", url, true);
        xhr.onload = function () {
            var respuesta = JSON.parse(xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == "200") {
                cleanOldInfoMuseo();
                cleanOldStuff('grupoMuseos');
                showMuseosAntiguos();
                $('#mensajeBien1').show();
            } else {
                alert('Ha ocurrido un error. Intentelo mas tarde.');
                console.error(respuesta);
            }
        }
        xhr.send(null);
    }
}