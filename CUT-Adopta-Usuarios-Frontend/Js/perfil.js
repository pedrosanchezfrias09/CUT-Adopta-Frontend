let API_URL = "https://pedrocutadopta.onrender.com";

// Script para llenar los inputs del perfil con la información del usuario
document.addEventListener("DOMContentLoaded", async function () {
    // Obtener el usuario desde localStorage y extraer el email y token
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userToken = localStorage.getItem("token");
    const userEmail = userData ? userData.email : null;
    
    if (!userEmail || !userToken) {
        console.error("Error: Usuario no autenticado");
        alert("Usuario no autenticado");
        return;
    }

    console.log("Token de usuario obtenido:", userToken); // Verificar si el token se obtiene correctamente

    try {
        console.log("Enviando petición a la API con email:", userEmail);
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
            console.error("Error en la respuesta de la API:", response.status, errorData);
            throw new Error(`Error al obtener datos del usuario: ${response.statusText}`);
        }

        const userData = await response.json();
        console.log("Datos del usuario obtenidos:", userData);
        
        // Función para evitar valores null en los inputs
        const safeValue = (value) => value !== null && value !== undefined ? value : "";
        
        // Llenar los inputs con los datos obtenidos
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
    } catch (error) {
        console.error("Error al cargar el perfil del usuario:", error);
    }
});

//Boton editar

function editar(){
    const inputs = document.querySelectorAll("input[disabled]");
    const botonEditar = document.getElementById("botonEditar");
    inputs.forEach(input => input.removeAttribute("disabled"));


    if (botonEditar.textContent === "Editar") {
        botonEditar.textContent = "Guardar";
    }
    else if (botonEditar.textContent === "Guardar") {
        actualizarPerfil();
    }
}  


async function actualizarPerfil() {
    console.log('Actualizando perfil');

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

    cuerpo.cellphone = cuerpo.cellphone ? parseInt(cuerpo.cellphone, 10): null;

    console.log('Datos del perfil a enviar:', cuerpo);

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
