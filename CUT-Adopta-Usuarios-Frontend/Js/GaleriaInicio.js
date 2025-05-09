const container = document.getElementById('containerPerros');

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM fully loaded and parsed');

    let response, data;

    try {
        response = await fetch('https://cut-adopta-backend-perritos.onrender.com/ObtenerTodosLosPerros');
        data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Error al obtener los perritos:", error);
        return;
    }

    let contadorPerro = 0;
    let tempContainer = ''; // Contenedor temporal para cada grupo de 4 perros

    for (const perro of data) {
        contadorPerro++;

        // URL de imagen o imagen por defecto
        const imagenUrl = perro.imagen_url && perro.imagen_url.trim() !== ""
            ? perro.imagen_url
            : "../Assets/PastorAleman.jpg";

        tempContainer += `
            <div class="pet-card">
                <img src="${imagenUrl}" alt="${perro.nombre}" class="pet-image">
                <div class="pet-info">
                    <div class="pet-header">
                        <h3 class="pet-name">${perro.nombre}</h3>
                        <span>${perro.sexo === 'hembra' ? '♀️' : '♂️'}</span>
                    </div>  
                    <p class="pet-description">${perro.descripcion}</p>
                    <a href="./PerroInfoDetallada.html?id=${perro.id}" class="ver-detalles">Ver detalles</a>
                </div>
            </div>
        `;

        // Cada 4 perritos, crea una fila
        if (contadorPerro === 4) {
            container.innerHTML += `
                <div class="pets-grid">
                    ${tempContainer}
                </div>
            `;
            tempContainer = ''; // Resetear
            contadorPerro = 0;
        }
    }

    // Si sobran perros, agrégalo al final
    if (tempContainer !== '') {
        container.innerHTML += `
            <div class="pets-grid">
                ${tempContainer}
            </div>
        `;
    }
});
