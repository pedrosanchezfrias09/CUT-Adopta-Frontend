const API_URL = "https://cut-adopta-backend-perritos.onrender.com";

let imagenSeleccionada = null;

document.addEventListener('DOMContentLoaded', function () {
    const registrarPerroBtn = document.getElementById('registrarPerroBtn');
    if (registrarPerroBtn) {
        registrarPerroBtn.addEventListener('click', registrarPerro);
    }

    const fileInput = document.getElementById('profilePictureUpload');
    if (fileInput) {
        fileInput.addEventListener('change', mostrarVistaPrevia);
    }
});

function mostrarVistaPrevia(event) {
    const file = event.target.files[0];
    if (file) {
        imagenSeleccionada = file;
        const vista = document.getElementById("profilePicture");
        vista.src = URL.createObjectURL(file);
    }
}

function obtenerValoresFormulario() {
    return {
        nombre: document.getElementById('fullName').value,
        estado: document.getElementById('estado').value,
        edad: parseInt(document.getElementById('edad').value, 10),
        raza: document.getElementById('raza').value,
        tamaño: document.getElementById('tamaño').value,
        sexo: document.getElementById('sexo').value,
        tipo: document.getElementById('tipo').value,
        descripcion: document.getElementById('descripcion').value,
        vacunado: document.getElementById('vacunado').checked,
        esterilizado: document.getElementById('esterilizado').checked,
        desparacitado: document.getElementById('desparacitado').checked,
        fechaRegistro: new Date().toISOString().split('T')[0]
    };
}

function validacionDeDatos(datosPerro) {
    if (!datosPerro.nombre) return alert("El nombre del perro es obligatorio.");
    if (!datosPerro.estado) return alert("El estado del perro es obligatorio.");
    if (isNaN(datosPerro.edad)) return alert("La edad debe ser un número.");
    if (!datosPerro.raza) return alert("La raza es obligatoria.");
    if (!datosPerro.tamaño) return alert("El tamaño es obligatorio.");
    return true;
}

async function subirImagenACloudinary() {
    if (!imagenSeleccionada) return null;

    const formData = new FormData();
    formData.append("file", imagenSeleccionada);

    try {
        const response = await fetch(`${API_URL}/subir_imagen_perrito`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("Error al subir imagen:", error);
            alert("Error al subir imagen");
            return null;
        }

        const data = await response.json();
        console.log("Imagen subida:", data.imagen_url);
        return data.imagen_url;
    } catch (error) {
        console.error("Error en subida a Cloudinary:", error);
        alert("Error al subir imagen a Cloudinary");
        return null;
    }
}

async function registrarPerro() {
    const datosPerro = obtenerValoresFormulario();
    if (!validacionDeDatos(datosPerro)) return;

    // 1. Subir imagen a Cloudinary
    const imagenURL = await subirImagenACloudinary();
    if (imagenURL) {
        datosPerro.imagen_url = imagenURL;
    }

    // 2. Enviar los datos del perro
    try {
        const respuesta = await fetch(`${API_URL}/SubirPerro`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosPerro)
        });

        if (!respuesta.ok) {
            const errorTexto = await respuesta.text();
            console.error("Error en respuesta del backend:", errorTexto);
            throw new Error("Error en el registro del perro");
        }

        const data = await respuesta.json();
        console.log("Perro registrado:", data);
        alert("El perro ha sido registrado correctamente.");
        limpiarFormulario();
    } catch (error) {
        console.error("Error al registrar el perro:", error);
        alert("Hubo un error al registrar el perro.");
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
    document.getElementById('profilePicture').src = "../Assets/avatar.png";
    document.getElementById('profilePictureUpload').value = "";
    imagenSeleccionada = null;
}
