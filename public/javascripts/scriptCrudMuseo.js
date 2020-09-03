
var museoSeleccionado = null;
var museos = [];
$(document).ready(function () {
    $('#editorMuseo').hide();
    $('#editorEnlaces').hide();
    $('#editorSalas').hide();
    $('#mensajeError1').hide();
    museoSeleccionado = null;
    showMuseosAntiguos();
    $('#btnNuevoMuseo').click(function (){
        museoSeleccionado = "nuevo";
        $('#btnDangerMuseo').html('Cancelar');
        $('#editorMuseo').show();
        $('#mensajeError1').hide();
    });
});

function showData(id){
    if(museoSeleccionado == null){
        $('#editorMuseo').hide();
        $('#editorEnlaces').hide();
        $('#editorSalas').hide();
        $('#mensajeError1').show();
    }else{
        $('#mensajeError1').hide();
        if($(id). is(":hidden")){
            $(id).show();
        }else{
            $(id).hide();
        }
    }
    return false;
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
    $('#nombreMuseo').val(museoSeleccionado.nombreMuseo);
    if(museoSeleccionado.activo == 1){
        $('#estadoMuseo option:eq(0)').prop('selected', true);
        $('#estadoMuseo').prop('disabled', 'disabled');
    }else{
        $('#estadoMuseo option:eq(1)').prop('selected', true);
        $('#estadoMuseo').prop('disabled', false);
    }
    return false;
}