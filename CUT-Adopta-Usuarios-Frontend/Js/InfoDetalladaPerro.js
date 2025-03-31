document.addEventListener('DOMContentLoaded', function () {
    // Obtener el parámetro 'id' de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const perroId = urlParams.get('id');

    obtenerPerro(perroId);

    // Agregar evento al botón de editar
    const editarPerfilBtn = document.getElementById('editarPerfilBtn');
    if (editarPerfilBtn) {
        editarPerfilBtn.addEventListener('click', toggleEdicion);
    }

    const botonEliminar = document.getElementById('botonEliminar');
    if (botonEliminar) {
        botonEliminar.addEventListener('click', eliminarPerrito);
    }
});

// Objeto para almacenar referencias a los elementos del DOM
let elements = {};

function getElementByIdss() {
    elements = {
        fullName: document.getElementById('fullName'),
        estado: document.getElementById('estado'),
        registrationDate: document.getElementById('registrationDate'),
        edad: document.getElementById('edad'),
        raza: document.getElementById('raza'),
        tamaño: document.getElementById('tamaño'),
        sexo: document.getElementById('sexo'),
        tipo: document.getElementById('tipo'),
        descripcion: document.getElementById('descripcion'),
        vacunado: document.getElementById('vacunado'),
        esterilizado: document.getElementById('esterilizado'),
        desparacitado: document.getElementById('desparacitado')
    };
}

function getValues() {
    return {
        nombre: elements.fullName.value,
        estado: elements.estado.value,
        fechaRegistro: elements.registrationDate.value,
        edad: elements.edad.value,
        raza: elements.raza.value,
        tamaño: elements.tamaño.value,
        sexo: elements.sexo.value,
        tipo: elements.tipo.value,
        descripcion: elements.descripcion.value,
        vacunado: elements.vacunado.checked,
        esterilizado: elements.esterilizado.checked,
        desparacitado: elements.desparacitado.checked
    };
}

function obtenerPerro(perroId) {
    if (perroId) {
        console.log("ID del perro:", perroId);

        // Hacer una solicitud a la API para obtener los detalles del perro
        fetch(`https://pedrocutadopta.onrender.com/ObtenerPerroPorId/${perroId}`)
            .then(response => response.json())
            .then(data => {
                console.log("Detalles del perro:", data);
                getElementByIdss(); // Obtener referencias a los elementos del DOM

                // Actualizar los valores de los inputs
                elements.fullName.value = data.nombre;
                elements.estado.value = data.estado;
                elements.registrationDate.value = data.fechaRegistro;
                elements.edad.value = data.edad;
                elements.raza.value = data.raza;
                elements.tamaño.value = data.tamaño;
                elements.sexo.value = data.sexo;
                elements.tipo.value = data.tipo;
                elements.descripcion.value = data.descripcion;
                elements.vacunado.checked = data.vacunado;
                elements.esterilizado.checked = data.esterilizado;
                elements.desparacitado.checked = data.desparacitado;
            })
            .catch(error => {
                console.error("Error al obtener los detalles del perro:", error);
            });
    } else {
        console.error("No se proporcionó un ID de perro en la URL.");
    }
}


function eliminarPerrito() {
    // Obtener el ID del perro de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const perroId = urlParams.get('id');

    if (!perroId) {
        console.error("No se proporcionó un ID de perro.");
        return;
    }

    // Mostrar una confirmación antes de eliminar
    const confirmacion = confirm("¿Estás seguro de que deseas eliminar a este perrito?");
    if (!confirmacion) {
        return; // Si el usuario cancela, no hacer nada
    }

    // Enviar una solicitud DELETE al backend
    fetch(`https://pedrocutadopta.onrender.com/perros/${perroId}`, {
        method: "DELETE"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al eliminar el perrito");
        }
        return response.text(); // Leer la respuesta como texto
    })
    .then(mensaje => {
        alert(mensaje); // Mostrar el mensaje de éxito
        // Redirigir a la página principal o a otra página después de eliminar
        window.location.href = "../Pages/galeriaDeInicioLog.html";
    }) // Ruta relativa al archivo HTML
    .catch(error => {
        console.error("Error al eliminar el perrito:", error);
        alert("Hubo un error al eliminar el perrito.");
    });
}

function toggleEdicion() {
    getElementByIdss(); // Asegurarse de que los elementos estén actualizados

    // Verificar si los campos están deshabilitados
    const isDisabled = elements.fullName.disabled;

    if (isDisabled) {
        // Si los campos están deshabilitados, habilitarlos (excepto registrationDate) y cambiar su color
        for (const key in elements) {
            if ((elements[key].tagName === 'INPUT' || elements[key].tagName === 'TEXTAREA' || elements[key].tagName === 'SELECT') &&
                elements[key].id !== 'registrationDate') { 
                elements[key].disabled = false; // Habilitar los campos
                elements[key].style.backgroundColor = "#f0f8ff"; // Cambiar color (azul claro)
                elements[key].style.border = "1px solid rgb(58, 58, 58)"; // Borde azul para resaltar
            }
        }
        // Cambiar el texto del botón a "Guardar Cambios"
        const editarPerfilBtn = document.getElementById('editarPerfilBtn');
        if (editarPerfilBtn) {
            editarPerfilBtn.textContent = "Guardar Cambios";
        }
    } else {
        // Si los campos están habilitados, guardar los cambios
        actualizarPerrito();

        // Deshabilitar nuevamente los campos y restaurar su color original
        for (const key in elements) {
            if ((elements[key].tagName === 'INPUT' || elements[key].tagName === 'TEXTAREA' || elements[key].tagName === 'SELECT') &&
                elements[key].id !== 'registrationDate') {
                elements[key].disabled = true; // Deshabilitar nuevamente
                elements[key].style.backgroundColor = ""; // Restaurar color original
                elements[key].style.border = ""; // Restaurar borde original
            }
        }

        // Restaurar el texto del botón
        const editarPerfilBtn = document.getElementById('editarPerfilBtn');
        if (editarPerfilBtn) {
            editarPerfilBtn.textContent = "Editar Perfil";
        }
    }
}

function actualizarPerrito() {
    // Obtener el ID del perro de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const perroId = urlParams.get('id');

    if (!perroId) {
        console.error("No se proporcionó un ID de perro.");
        return;
    }

    getElementByIdss(); // Asegurarse de que los elementos están actualizados

    // Obtener los valores del formulario
    const datosActualizados = getValues();

    // Hacer la solicitud PUT al backend con los datos actualizados
    fetch(`https://pedrocutadopta.onrender.com/ActualizarPerro/${perroId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datosActualizados) // Convertir el objeto a JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error en la actualización");
        }
        return response.json();
    })
    .then(data => {
        console.log("Perro actualizado:", data);
        alert("Los datos del perro han sido actualizados correctamente.");

        // Deshabilitar los campos después de actualizar
        for (const key in elements) {
            if (elements[key].tagName === 'INPUT' || elements[key].tagName === 'TEXTAREA') {
                elements[key].disabled = true;
            }
        }

        // Cambiar el texto del botón a "Editar Perfil"
        const editarPerfilBtn = document.getElementById('editarPerfilBtn');
        if (editarPerfilBtn) {
            editarPerfilBtn.textContent = "Editar Perfil";
        }

        // Recargar los datos del perro desde el servidor
        obtenerPerro(perroId);
    })
    .catch(error => {
        console.error("Error al actualizar los datos del perro:", error);
        alert("Hubo un error al actualizar los datos.");
    });
}