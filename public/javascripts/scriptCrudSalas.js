var museos = [];
var museoSeleccionado;
var salas = [];
var salaEspecifica;
var vistoBuenoNuevo = false;



$(document).ready(function () {
    hideStuff();
    showMuseosAntiguos();
    cleanSalaInfo();
    $('#museos').change(function (){
        hideStuff();
        posicion = $("#museos option:selected").attr('value');
        goMuseoEspecifico(posicion);
    });
    $('#primeraSala').change(function (){
        hideStuff();
    });
});

function hideStuff(){
    $('#mensajeError1').hide();
    $('#mensajeError2').hide();
    $('#mensajeError3').hide();
    $('#mensajeBien1').hide();
    $('#mensajeBien2').hide();
}

function showMuseosAntiguos(){
    cleanOldStuff('museos');
    var url  = "/crudMuseo/getMuseos";
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
    console.log(museos[posicion]);
    if(posicion!=-1){
        museoSeleccionado = museos[posicion];
    }  
    $('#mensajeError1').hide();
    cleanSalaInfo();
    cleanOldStuff('salas');
    cleanOldStuff('primeraSala');
    var url  = "/salas/api/getSalas/"+museoSeleccionado.idMuseo;
    var xhr  = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.onload = function () {
        var respuesta = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            salas = respuesta;
            for(var i=0;i<respuesta.length;i++){
                info = '<option value='+respuesta[i].idSala+'>Sala '+(i+1)+': '+respuesta[i].temaCuratorial+'</option>';
                info1 = '<a class="dropdown-item" href="#" value='+respuesta[i].idSala+' onclick="return goSalaEspecifica('+i+')">Sala '+(i+1)+': '+respuesta[i].temaCuratorial+'</a>';
                $('#primeraSala').append(info);
                $('#salas').append(info1);
            }
            if(museoSeleccionado.idSalaInicial != null){
                $('#primeraSala option[value='+ museoSeleccionado.idSalaInicial +']').attr("selected",true);
            }
            
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

function guardarPrimera(){
    idMuseo = museoSeleccionado.idMuseo;
    idSala = $("#primeraSala option:selected").attr('value');
    var xhr = new XMLHttpRequest();
    xhr.open("GET", '/crudSalas/saveSalaInicial/'+idMuseo+'/'+idSala, true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            $('#mensajeBien1').show();
            museoSeleccionado.idSalaInicial = idSala;
        } else if(xhr.status == '401'){
            $("#modal-sesion").modal();
            $('#modal-sesion').on('hidden.bs.modal', function () {
                window.location.replace("/editor");
            });
        }else {
            alert('Ha ocurrido un error. Intentelo mas tarde.');
        }
    }
    xhr.send(null);
    
}

function cleanSalaInfo(){
    salaEspecifica = "nuevo";
    $('#temaCuratorial').val("");
    $('#rotacion').val(0);
    $('#imagenActual').val("");
    $('#myfileImagen').val("");
    $('#btnDangerSala').html('Cancelar');
}

function goSalaEspecifica(posicion){
    hideStuff();
    if(posicion != -1){
        salaEspecifica = salas[posicion];
        $('#temaCuratorial').val(salaEspecifica.temaCuratorial);
        $('#rotacion').val(salaEspecifica.rotacionInicial);
        $('#myfileImagen').val("");
        $('#imagenActual').val(salaEspecifica.nombreImgFondo);
        $('#btnDangerSala').html('Eliminar');
    }else{
        cleanSalaInfo();
    }
    return false;
}

function validarData(){
    if($('#temaCuratorial').val().trim() != ''){

        if($('#temaCuratorial').val() == '' || (salaEspecifica == 'nuevo' && $('#myfileImagen')[0].files.length==0)){
            $('#mensajeError1').show();
            return false;
        }else{
            temaC = $('#temaCuratorial').val();
        // nameFile = $('#myfileImagen')[0].files[0].name;
            $('#mensajeError1').hide();//validateString(nameFile)
            if(validateString(temaC) && ((salaEspecifica == 'nuevo' && validateString($('#myfileImagen')[0].files[0].name)) || (salaEspecifica!='nuevo' && $('#myfileImagen')[0].files.length>0 && validateString($('#myfileImagen')[0].files[0].name)) || (salaEspecifica!='nuevo' && $('#myfileImagen')[0].files.length==0))){
                $('#mensajeError3').hide();
                return true;
            }else{
                $('#mensajeError3').show();
                return false;
            }
            //return true;
        }
    }else{
        $('#mensajeError1').show();
        return false;
    }
}

function validateString(data){
    for (var i=0;i<data.length;i++){
        if(data[i] == '\'' || data[i] == '"'){
            return false;
        }
    }
    return true;

}

function transformEspacios(data){
    
}

function saveSala(){
    if(validarData()){
        //salvar los datos de la sala y luego la imagen -> transaccion 
        var data = new FormData();
        data.append('rotacion', $('#rotacion').val());
        data.append('tema', $('#temaCuratorial').val());
        if($('#imagenActual').val() != ''){
            data.append('antiguoFile', $('#imagenActual').val());
        }
        if($('#myfileImagen')[0].files.length > 0){
            if(salaEspecifica != 'nuevo'){
                data.append(salaEspecifica.idSala+'-'+$('#myfileImagen')[0].files[0].name.replace(' ', ''), $('#myfileImagen')[0].files[0]);
                data.append('nuevoArchivo', salaEspecifica.idSala+'-'+$('#myfileImagen')[0].files[0].name.replace(' ', ''));
            }
        }
        if(salaEspecifica!='nuevo'){
            data.append('idSala', salaEspecifica.idSala);
        }else{
            data.append('idSala', -1);
        }
        data.append('idMuseo', museoSeleccionado.idMuseo);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", '/crudSalas/saveSala', true);
        xhr.onload = function () {
            if (xhr.readyState == 4 && xhr.status == "200") {
                if(salaEspecifica == 'nuevo'){
                    var data = new FormData();
                    resultados = JSON.parse(xhr.responseText);
                    console.log(resultados);
                    data.append(resultados.insertId+'-'+$('#myfileImagen')[0].files[0].name.replace(' ', ''), $('#myfileImagen')[0].files[0]);
                    data.append('nuevoArchivo', resultados.insertId+'-'+$('#myfileImagen')[0].files[0].name.replace(' ', ''));
                    data.append('idSala', resultados.insertId);
                    saveImage(data);
                }else{
                    $('#mensajeBien2').show();
                    cleanSalaInfo();
                    goMuseoEspecifico(-1);
                }

            } else if(xhr.status == '401'){
                $("#modal-sesion").modal();
                $('#modal-sesion').on('hidden.bs.modal', function () {
                    window.location.replace("/editor");
                });
            }else {
                alert('Ha ocurrido un error. Intentelo mas tarde.');
            }
        }
        xhr.send(data);

    }
    return false;
}

function saveImage(data){
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", '/crudSalas/saveImage', true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            $('#mensajeBien2').show();
            cleanSalaInfo();
            goMuseoEspecifico(-1);
        } else if(xhr.status == '401'){
            $("#modal-sesion").modal();
            $('#modal-sesion').on('hidden.bs.modal', function () {
                window.location.replace("/editor");
            });
        }else {
            alert('Ha ocurrido un error. No se guardo la imagen.');
            cleanSalaInfo();
            goMuseoEspecifico(-1);
        }
    }
    xhr.send(data);
}

function actionDangerSala(){
    if(salaEspecifica == 'nuevo'){
        goSalaEspecifica(-1);
    }else{
        if(salaEspecifica.idSala == museoSeleccionado.idSalaInicial && museoSeleccionado.activo == 1){
            $('#mensajeError2').show();
        }else{
            var data = {};
            data.idSala = salaEspecifica.idSala;
            data.nombreArchivo = salaEspecifica.nombreImgFondo;
            var url = "/crudSalas/deleteSala";
            var xhr = new XMLHttpRequest();
            xhr.open("DELETE", url, true);
            xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
            xhr.onload = function () {
                var respuesta = JSON.parse(xhr.responseText);
                if (xhr.readyState == 4 && xhr.status == "200") {
                    hideStuff();
                    cleanSalaInfo();
                    goMuseoEspecifico(-1);
                    $('#mensajeBien2').show();
                } else if(xhr.status == '401'){
                    $("#modal-sesion").modal();
                    $('#modal-sesion').on('hidden.bs.modal', function () {
                        window.location.replace("/editor");
                    });
                }else {
                    alert('Ha ocurrido un error. Intentelo mas tarde.');
                    console.error(respuesta);
                }
            }
            xhr.send(JSON.stringify(data));
        }
        
    }
}