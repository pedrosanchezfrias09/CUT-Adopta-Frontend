function initTraduccion() {
    new google.translate.TranslateElement({
      pageLanguage: 'es',
      includedLanguages: 'en,es',
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
  
    // Obtener el elemento de traducción
    var translateElement = document.getElementById('google_translate_element');
  
    // Establecer un estilo personalizado
    translateElement.style.width = '150px';
    translateElement.style.height = '75px';
  }

  const menuToggle = document.querySelector('.menu-toggle');
        const menuContainer = document.querySelector('.menu-container');
        const overlay = document.querySelector('.overlay');
        
        // Función para abrir el menú
        function openMenu() {
            menuContainer.classList.add('active');
            overlay.classList.add('active');
        }
        
        // Función para cerrar el menú
        function closeMenu() {
            menuContainer.classList.remove('active');
            overlay.classList.remove('active');
            // También cerramos todos los submenús
            document.querySelectorAll('.submenu.active').forEach(submenu => {
                submenu.classList.remove('active');
            });
        }
        
        // Toggle menú principal
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            if (menuContainer.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        // Cerrar al hacer click en el overlay
        overlay.addEventListener('click', closeMenu);
        
        // Toggle submenús
        document.querySelectorAll('.menu-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                // Cierra todos los otros submenús
                document.querySelectorAll('.submenu.active').forEach(submenu => {
                    if (submenu !== this.nextElementSibling) {
                        submenu.classList.remove('active');
                    }
                });
                // Toggle el submenu actual
                this.nextElementSibling.classList.toggle('active');
            });
        });
        
        // Prevenir que los clicks dentro del menú lo cierren
        menuContainer.addEventListener('click', function(e) {
            e.stopPropagation();
        });
// Función para validar email
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Configurar toggle de contraseña
function setupPasswordToggle() {
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('ion-icon');
            
            input.classList.add('transitioning');
            icon.style.transform = 'rotate(180deg)';
            
            setTimeout(() => {
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                icon.setAttribute('name', 
                    type === 'password' ? 'eye-outline' : 'eye-off-outline'
                );
                
                input.classList.remove('transitioning');
                icon.style.transform = 'rotate(0deg)';
            }, 150);
        });
    });
}

// Función para mostrar mensajes
function mostrarMensaje(mensaje, tipo) {
    const mensajeContainer = document.getElementById('mensajeContainer');
    mensajeContainer.textContent = mensaje;
    mensajeContainer.className = `mensaje mensaje-${tipo}`;
    mensajeContainer.style.display = 'block';

    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
        mensajeContainer.style.display = 'none';
    }, 5000);
}

// js/login.js
document.getElementById('loginButton').addEventListener('click', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const spinner = document.getElementById('loginSpinner');
    const buttonText = this.querySelector('span');

    // 🔹 **Validaciones antes de enviar la petición**
    if (!email || !password) {
        mostrarMensaje('Por favor, completa todos los campos.', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        mostrarMensaje('Por favor, introduce un correo válido.', 'error');
        return;
    }

    try {
        spinner.style.display = 'inline-block';
        buttonText.textContent = 'Iniciando sesión...';
        this.disabled = true;

        const response = await fetch(`${config.API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            mostrarMensaje('¡Inicio de sesión exitoso!', 'exito');
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('userData', JSON.stringify(data.user));
            
            setTimeout(() => {
                window.location.href = '/Pages/galeriaDeInicioLog.html';
            }, 1000);
        } else {
            const mensajesError = {
                404: 'Usuario no encontrado',
                401: 'Contraseña incorrecta',
                403: 'Cuenta deshabilitada',
                500: 'Error en el servidor'
            };
            mostrarMensaje(mensajesError[response.status] || data.detail, 'error');
        }
    } catch (error) {
        mostrarMensaje('Error al conectar con el servidor', 'error');
        console.error('Error:', error);
    } finally {
        spinner.style.display = 'none';
        buttonText.textContent = 'Entrar';
        this.disabled = false;
    }
});
