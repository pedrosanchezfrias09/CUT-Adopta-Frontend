/*{ <div class="pets-grid">
            <!-- Card 1 -->
            <div class="pet-card">
                <img src="../Assets/Perro1.png" alt="Momo">
                <div class="pet-info">
                    <div class="pet-header">
                        <h3 class="pet-name">Momo</h3>
                        <span>♀️</span>
                    </div>
                    <p class="pet-description">Conoce a Momo, una perrita llena de amor y ternura. ¡Cambia su vida para siempre!</p>
                    <a href="#" class="ver-detalles">Ver detalles</a>
                </div>
            </div>
            <div class="pet-card">
                <img src="../Assets/Perro2.png" alt="Momo">
                <div class="pet-info">
                    <div class="pet-header">
                        <h3 class="pet-name">Max</h3>
                        <span>♂️</span>
                    </div>
                    <p class="pet-description">Conoce a Max, un perrito lleno de amor y ternura. ¡Cambia su vida para siempre!</p>
                    <a href="#" class="ver-detalles">Ver detalles</a>
                </div>
            </div>
            <div class="pet-card">
                <img src="../Assets/Perro3.png" alt="Momo">
                <div class="pet-info">
                    <div class="pet-header">
                        <h3 class="pet-name">Bella</h3>
                        <span>♀️</span>
                    </div>
                    <p class="pet-description">Conoce a Bella, una perrita llena de amor y ternura. ¡Cambia su vida para siempre!</p>
                    <a href="#" class="ver-detalles">Ver detalles</a>
                </div>
            </div>
            <div class="pet-card">
                <img src="../Assets/Perro4.png" alt="Momo">
                <div class="pet-info">
                    <div class="pet-header">
                        <h3 class="pet-name">Rockie</h3>
                        <span>♂️</span>
                    </div>
                    <p class="pet-description">Conoce a Rockie, un perrito lleno de amor y ternura. ¡Cambia su vida para siempre!</p>
                    <a href="#" class="ver-detalles">Ver detalles</a>
                </div>
            </div>
        </div> } */


        const container = document.getElementById('containerPerros');
    
        document.addEventListener('DOMContentLoaded', async () => {
           
            console.log('DOM fully loaded and parsed');

            let response
            let data
            try {
            response = await fetch('https://pedrocutadopta.onrender.com/MicroPerritos/ObtenerTodosLosPerros');
            data = await response.json();
            console.log(data);
           } catch (error) {
            console.error(error);
           } 
         
        
            let contadorPerro = 0;
            let tempContainer = ''; // Contenedor temporal para almacenar los pet-card
        
            for (const perro of data) {
                contadorPerro++;
        
                // Agregar el pet-card al contenedor temporal
                        tempContainer += `
            <div class="pet-card">
                <img src="../Assets/PastorAleman.jpg" alt="${perro.nombre}">
                <div class="pet-info">
                    <div class="pet-header">
                        <h3 class="pet-name">${perro.nombre}</h3>
                        <span>${perro.sexo === 'Femenino' ? '♀️' : '♂️'}</span>
                    </div>  
                    <p class="pet-description">${perro.descripcion}</p>
                    <a href="./PerroInfoDetallada.html?id=${perro.id}" class="ver-detalles">Ver detalles</a>
                </div>
            </div>
        `;
                // Cada 4 perros, crear un nuevo pet-grid y agregar los pet-card
                if (contadorPerro === 4) {
                    container.innerHTML += `
                        <div class="pets-grid">
                            ${tempContainer}
                        </div>
                    `;
                    tempContainer = ''; // Resetear el contenedor temporal
                    contadorPerro = 0; // Resetear el contador
                }
            }
        
            // Si quedan perros que no completan un grupo de 4, agregarlos al final
            if (tempContainer !== '') {
                container.innerHTML += `
                    <div class="pets-grid">
                        ${tempContainer}
                    </div>
                `;
            }
        });
