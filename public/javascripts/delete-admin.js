$(document).on("click", ".eliminar", function () {
    let id = $(this).data('id');
    $("#modal_eliminar").val(id);
    $("#body_modal_eliminar").html("Se procederá a eliminar el usuario: ")
    let texto = $("#body_modal_eliminar").html();
    $("#body_modal_eliminar").html(texto + " " + $(this).data('info'));
});

$(document).on("click", "#aceptar_eliminar", function () {
    let id = $("#modal_eliminar").val();
    let elemento = document.getElementById(id);
    if (!elemento) {
        alert("El usuario seleccionado ya no existe.");
    } else {
        var padre = elemento.parentNode;
        fetch(`/editor/usuarios/quitar/${id}`, { method: 'DELETE' })
            .then(function (res) {
                if (res.status === 200) {
                    padre.removeChild(elemento);
                } else if (res.status === 401) {
                    $("#modal-sesion").modal();
                    $('#modal-sesion').on('hidden.bs.modal', function () {
                        window.location.replace("/editor");
                    });
                }
            })
    }
});