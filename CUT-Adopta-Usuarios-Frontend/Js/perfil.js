document.addEventListener("cargar_contenido", async function () {
    const API_URL = "https://pedrocutadopta.onrender.com";
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userEmail = userData ? userData.email: null;

    if (! userEmail){
        alert("Usuario No Encontrado");
        return;
    }

    try{
        const response = await
        fetch(`${API_URL}`/usuario/`${userEmail}`);

        if (! response.ok){
            throw new Error ("Error al obtener datos del usuario");
        }

        const userData = await response.json();

        document.getElementById(fullName).value = userData.name || "";
        document.getElementById(birthDate).value = userData.birth_date || "";
        document.getAnimations(registrationDate).value = userData.register_date || "";
        document.getElementById(email).value = userData.email || "";
        document.getElementById(phone).value = userData.cellphone || "";
        document.getElementById(state).value = userData.state || "";
        document.getElementById(city).value = userData.city || "";
        document.getElementById(street).value = userData.street || "";
        document.getElementById(colony).value = userData.colony || "";
        document.getElementById(postalCode).value = userData.postal_code || "";
        document.getElementById(houseNumber).value = userData.house_number || "";
        document.getElementById(accountStatus).value = userData.status || "";

    }catch(error)
        {console.log("Error al cargar el perfil: ", error)}

})

