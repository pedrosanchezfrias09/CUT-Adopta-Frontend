let API_URL = "https://pedrocutadopta.onrender.com";

// Script para llenar los inputs del perfil con la información del usuario
document.addEventListener("DOMContentLoaded", async function () {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userToken = localStorage.getItem("token");
    const userEmail = userData ? userData.email : null;

    if (!userEmail || !userToken) {
        alert("Usuario no autenticado");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/usuario/${userEmail}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${userToken}`,
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error al obtener datos del usuario: ${response.statusText}`);
        }

        const userData = await response.json();

        const safeValue = (value) => value !== null && value !== undefined ? value : "";

        document.getElementById("fullName").value = safeValue(userData.name);
        document.getElementById("birthDate").value = safeValue(userData.birth_date);
        document.getElementById("registrationDate").value = safeValue(userData.register_date);
        document.getElementById("email").value = safeValue(userData.email);
        document.getElementById("phone").value = safeValue(userData.cellphone);
        document.getElementById("state").value = safeValue(userData.state);
        document.getElementById("street").value = safeValue(userData.street);
        document.getElementById("colony").value = safeValue(userData.suburb);
        document.getElementById("postalCode").value = safeValue(userData.postal_code);
        document.getElementById("houseNumber").value = safeValue(userData.house_number);
        document.getElementById("accountStatus").value = safeValue(userData.status);
        document.getElementById("city").value = safeValue(userData.city);

        // Mostrar imagen si ya existe
        if (userData.imagen_url) {
            document.getElementById("profilePicture").src = userData.imagen_url;

        }
    } catch (error) {
        console.error("Error al cargar el perfil del usuario:", error);
    }
});

// Función para mostrar vista previa
var loadFile = function (event) {
    var image = document.getElementById('profilePicture');
    image.src = URL.createObjectURL(event.target.files[0]);
    subirImagen();  // Llama a la función que sube la imagen
};

async function subirImagen() {
    const archivo = document.getElementById("profilePictureUpload").files[0];
    const userToken = localStorage.getItem("token");

    if (!archivo) return;

    const formData = new FormData();
    formData.append("file", archivo);

    try {
        const response = await fetch(`${API_URL}/subir_imagen_usuario`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${userToken}`
            },
            body: formData
        });

        if (!response.ok) {
            const err = await response.json();
            console.error("Error al subir imagen:", err);
            return;
        }

        const data = await response.json();
        console.log("Imagen subida con éxito:", data.imagen_url);

        // Actualizar el campo en la base de datos
        await fetch(`${API_URL}/actualizar_usuario`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
                "Accept": "application/json",
            },
            body: JSON.stringify({ imagen_url: data.imagen_url, email: JSON.parse(localStorage.getItem("userData")).email })
        });
    } catch (error) {
        console.error("Error al subir la imagen:", error);
    }
}

// Botón editar
function editar() {
    const inputs = document.querySelectorAll("input[disabled]");
    const botonEditar = document.getElementById("botonEditar");
    inputs.forEach(input => input.removeAttribute("disabled"));

    if (botonEditar.textContent === "Editar") {
        botonEditar.textContent = "Guardar";
    } else if (botonEditar.textContent === "Guardar") {
        actualizarPerfil();
    }

    //deshabilitar el botón de correo y de fecha de registro y de cuenta
    document.getElementById("email").disabled = true;
    document.getElementById("registrationDate").disabled = true;
    document.getElementById("accountStatus").disabled = true;

}

async function actualizarPerfil() {
    const email = JSON.parse(localStorage.getItem("userData")).email;
    const userToken = localStorage.getItem("token");

    let cuerpo = {
        email,
        birth_date: document.getElementById("birthDate").value || null,
        cellphone: document.getElementById("phone").value || null,
        state: document.getElementById("state").value || null,
        street: document.getElementById("street").value || null,
        suburb: document.getElementById("colony").value || null,
        postal_code: document.getElementById("postalCode").value || null,
        house_number: document.getElementById("houseNumber").value || null,
        city: document.getElementById("city").value || null
    };

    cuerpo.cellphone = cuerpo.cellphone ? parseInt(cuerpo.cellphone, 10) : null;

    try {
        let response = await fetch(`${API_URL}/actualizar_usuario`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
                "Accept": "application/json",
            },
            body: JSON.stringify(cuerpo)
        });

        if (!response.ok) {
            const infoError = await response.json();
            console.error(`Error actualizando perfil: ${infoError}`);
        } else {
            console.log('Perfil actualizado correctamente');
            window.location.reload();
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}
