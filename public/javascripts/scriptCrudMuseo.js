
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
        $('#mensajeError7').hide();
        $('#mensajeBien1').hide();
    });
    showMuseosAntiguos();
    $('#btnNuevoMuseo').trigger('click');
    
});

function showMuseosAntiguos(){
    var url  = "http://localhost:3000/crudMuseo/getMuseos";
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
        } else if(xhr.status == '401'){
            $("#modal-sesion").modal();
            $('#modal-sesion').on('hidden.bs.modal', function () {
                window.location.replace("/editor");
            });
        }else {
            console.error(respuesta);
        }
    }
    xhr.send(null);
}

function goMuseoEspecifico(posicion){
    console.log(museos[posicion]);
    museoSeleccionado = museos[posicion];
    $('#btnDangerMuseo').html('Eliminar');
    hideStuff();
    $('#nombreMuseo').val(museoSeleccionado.nombreMuseo);
    $('#nombreMuseo').attr('idMuseo', museoSeleccionado.idMuseo);
    if(museoSeleccionado.activo == 1){
        $('#estadoMuseo option:eq(0)').prop('selected', true);
        $('#estadoMuseo').prop('disabled', 'disabled');
    }else if(museoSeleccionado.idSalaInicial != null){
        $('#estadoMuseo option:eq(1)').prop('selected', true);
        $('#estadoMuseo').prop('disabled', false);
    }else{
        $('#estadoMuseo option:eq(1)').prop('selected', true);
        $('#estadoMuseo').prop('disabled', 'disabled');
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

function hideStuff(){
    $('#mensajeError4').hide();
    $('#mensajeError5').hide();
    $('#mensajeError6').hide();
    $('#mensajeError7').hide();
    $('#mensajeBien1').hide();
}

function cleanOldInfoMuseo(){
    hideStuff();
    $('#btnDangerMuseo').html('Cancelar');
    $('#nombreMuseo').val("");
    $('#estadoMuseo option:eq(1)').prop('selected', true);
    $('#estadoMuseo').prop('disabled', 'disabled');
    $('#audioActual').val("");
    $("#myfileAudio").val("");
    
}


function validateMuseoInfo(){
    hideStuff();
    if($('#nombreMuseo').val().trim() != ''){
        if($('#nombreMuseo').val() == '' || (museoSeleccionado == 'nuevo' && $('#myfileAudio')[0].files.length==0)){
            $('#mensajeError4').show();
            //$('#mensajeError5').hide();
            
            return false;
        }else{
            //$('#mensajeError4').hide();
            if (validateNameMuseo()){
               if(validateString($('#nombreMuseo').val()) && ((museoSeleccionado == 'nuevo' && validateString($('#myfileAudio')[0].files[0].name)) || (museoSeleccionado!='nuevo' && $('#myfileAudio')[0].files.length>0 && validateString($('#myfileAudio')[0].files[0].name)) || (museoSeleccionado!='nuevo' && $('#myfileAudio')[0].files.length==0))){
                    return true;
                }else{
                    $('#mensajeError7').show();
                    return false;
                }
                //return true;
            }else{
                return false;
            }
            
        }
    }else{
        $('#mensajeError4').show();
        return false;
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

function validateString(data){
    for (var i=0;i<data.length;i++){
        if(data[i] == '\'' || data[i] == '"'){
            return false;
        }
    }
    return true;

}

function transformData(data){
    dataA = '';
    for(var i=0;i<data.length;i++){
        if(data[i] != ' '){
            dataA+=data[i];
        }
    }
    console.log('dataA', dataA);
    return dataA;
}

function saveInfoMuseo(){
    $('#mensajeError6').hide();
    if(validateMuseoInfo()){
        //console.log(document.getElementById('myfileAudio').files[0]);
        var data = new FormData();
        if($('#myfileAudio')[0].files.length>0){
            //console.log(transformData($('#nombreMuseo').val()),  $('#myfileAudio')[0].files[0].name.replace(' ', ''));
            data.append(transformData($('#nombreMuseo').val())+'-'+$('#myfileAudio')[0].files[0].name.replace(' ', ''), $('#myfileAudio')[0].files[0]);
            data.append('nombreArchivo', transformData($('#nombreMuseo').val())+'-'+$('#myfileAudio')[0].files[0].name.replace(' ', ''));
            data.append('estadoArchivo', 'nuevo');
        }else{
            if($('#nombreMuseo').val() != museoSeleccionado.nombreMuseo){
                nombreAudio = $('#audioActual').val().split('-');
                nuevoAudio = transformData($('#nombreMuseo').val())+'-';
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
                /*$('#audioActual').val(data.get('nombreArchivo'));
                $("#myfileAudio").val("");
                if($("#estadoMuseo option:selected").attr('value') == 1){
                    $('#estadoMuseo').prop('disabled', 'disabled');
                }*/
                museoSeleccionado = "nuevo";
                cleanOldInfoMuseo();
                cleanOldStuff('grupoMuseos');
                showMuseosAntiguos();
                $('#mensajeBien1').show();
            } else if(xhr.status == '401'){
                $("#modal-sesion").modal();
                $('#modal-sesion').on('hidden.bs.modal', function () {
                    window.location.replace("/editor");
                });
            }else{
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
        var url = "http://localhost:3000/crudMuseo/deleteMuseo";
        var xhr = new XMLHttpRequest();
        var data = {};
        data.idMuseo = museoSeleccionado.idMuseo;
        data.nombreArchivo = museoSeleccionado.nombreAudioFondo;
        xhr.open("DELETE", url, true);
        xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
        xhr.onload = function () {
            var respuesta = JSON.parse(xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == "200") {
                cleanOldInfoMuseo();
                cleanOldStuff('grupoMuseos');
                showMuseosAntiguos();
                $('#mensajeBien1').show();
                museoSeleccionado = "nuevo";
            } else if(xhr.status == '401'){
                $("#modal-sesion").modal();
                $('#modal-sesion').on('hidden.bs.modal', function () {
                    window.location.replace("/editor");
                });
            }else{
                alert('Ha ocurrido un error. Intentelo mas tarde.');
                console.error(respuesta);
            }
        }
        xhr.send(JSON.stringify(data));
    }
}