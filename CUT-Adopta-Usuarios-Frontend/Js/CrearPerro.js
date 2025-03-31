document.addEventListener('DOMContentLoaded', function () {
    const registrarPerroBtn = document.getElementById('registrarPerroBtn');
    if (registrarPerroBtn) {
        registrarPerroBtn.addEventListener('click', registrarPerro);
    }
});


function obtenerValoresFormulario() {
    return {
        nombre: document.getElementById('fullName').value,
        estado: document.getElementById('estado').value,
        // fechaRegistro: document.getElementById('registrationDate').value,
        edad: document.getElementById('edad').value,
        raza: document.getElementById('raza').value,
        tamaño: document.getElementById('tamaño').value,
        sexo: document.getElementById('sexo').value,
        tipo: document.getElementById('tipo').value,
        descripcion: document.getElementById('descripcion').value,
        vacunado: document.getElementById('vacunado').checked,
        esterilizado: document.getElementById('esterilizado').checked,
        desparacitado: document.getElementById('desparacitado').checked
    };
    
}

function validacionDeDatos(datosPerro) {
    if (!datosPerro.nombre) {
        alert("El nombre del perro es obligatorio.");
        return false;
    }
    if (!datosPerro.estado) {
        alert("El estado del perro es obligatorio.");
        return false;
    }
    if (!datosPerro.edad) {
        alert("La edad del perro es obligatoria.");
        return false;
    }
    if (!datosPerro.raza) {
        alert("La raza del perro es obligatoria.");
        return false;
    }
    if (!datosPerro.tamaño) {
        alert("El tamaño del perro es obligatorio.");
        return false;
    }

    return true;
}
async function registrarPerro() {

    
    let datosPerro = obtenerValoresFormulario();
    datosPerro.fechaRegistro = new Date().toISOString().split('T')[0];//le da la fecha automaticamente
    if (!validacionDeDatos(datosPerro)) {
        return;
    }
    else{
        console.log("Datos del perro:", datosPerro);
        try {
            let respuesta = await fetch('https://pedrocutadopta.onrender.com/MicroPerros/SubirPerro', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datosPerro)
            });
    
            if (!respuesta.ok) {
                throw new Error("Error en el registro del perro");
            }
    
            let data = await respuesta.json();
            console.log("Perro registrado:", data);
            alert("El perro ha sido registrado correctamente.");
            limpiarFormulario();
        } catch (error) {
            console.error("Error al registrar el perro:", error);
            alert("Hubo un error al registrar el perro.");
        }

    }

    
}

function limpiarFormulario() {
    document.getElementById('fullName').value = "";
    document.getElementById('estado').value = "";
    document.getElementById('edad').value = "";
    document.getElementById('raza').value = "";
    document.getElementById('tamaño').value = "";
    document.getElementById('sexo').value = "";
    document.getElementById('tipo').value = "";
    document.getElementById('descripcion').value = "";
    document.getElementById('vacunado').checked = false;
    document.getElementById('esterilizado').checked = false;
    document.getElementById('desparacitado').checked = false;
}
