document.addEventListener('DOMContentLoaded', function () {
    const registrarPerroBtn = document.getElementById('registrarPerroBtn');
    const profilePictureUpload = document.getElementById('profilePictureUpload');
    const profilePicture = document.getElementById('profilePicture');

    if (registrarPerroBtn) {
        registrarPerroBtn.addEventListener('click', registrarPerro);
    }

    // Hacer que el click en la imagen abra el input
    profilePicture.addEventListener('click', () => {
        profilePictureUpload.click();
    });

    // Mostrar vista previa
    profilePictureUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            profilePicture.src = URL.createObjectURL(file);
        }
    });
});

function obtenerValoresFormulario() {
    return {
        nombre: document.getElementById('fullName').value,
        estado: document.getElementById('estado').value,
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
    if (!datosPerro.nombre || !datosPerro.estado || !datosPerro.edad || !datosPerro.raza || !datosPerro.tamaño) {
        alert("Por favor completa todos los campos obligatorios.");
        return false;
    }

    if (isNaN(parseInt(datosPerro.edad))) {
        alert("La edad debe ser un número.");
        return false;
    }

    return true;
}

async function registrarPerro() {
    let datosPerro = obtenerValoresFormulario();
    datosPerro.fechaRegistro = new Date().toISOString().split('T')[0];

    if (!validacionDeDatos(datosPerro)) return;

    try {
        // Subir imagen si se eligió una
        const archivo = document.getElementById("profilePictureUpload").files[0];
        let imagenUrl = "";

        if (archivo) {
            const formData = new FormData();
            formData.append("file", archivo);

            const uploadResponse = await fetch("https://cut-adopta-backend-perritos.onrender.com/subir_imagen_perro", {
                method: "POST",
                body: formData
            });

            if (!uploadResponse.ok) {
                const err = await uploadResponse.text();
                console.error("Error al subir imagen:", err);
                alert("Error al subir imagen");
                return;
            }

            const data = await uploadResponse.json();
            imagenUrl = data.imagen_url;
        }

        datosPerro.edad = parseInt(datosPerro.edad);
        datosPerro.imagen_url = imagenUrl;

        const respuesta = await fetch("https://cut-adopta-backend-perritos.onrender.com/SubirPerro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosPerro)
        });

        if (!respuesta.ok) {
            const errorTexto = await respuesta.text();
            console.error("Error en respuesta del backend:", errorTexto);
            alert("Error al registrar el perrito.");
            return;
        }

        const result = await respuesta.json();
        console.log("Perro registrado:", result);
        alert("¡El perrito ha sido registrado correctamente!");
        limpiarFormulario();
    } catch (error) {
        console.error("Error al registrar el perro:", error);
        alert("Hubo un error inesperado.");
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
    document.getElementById('profilePictureUpload').value = "";
    document.getElementById('profilePicture').src = "../Assets/avatar.png";
}
