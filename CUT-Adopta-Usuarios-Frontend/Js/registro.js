// Funciones de validación existentes
const validaciones = {
    email: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return {
            valido: re.test(email),
            mensaje: 'Ingresa un email válido'
        };
    },
    password: (password) => {
        const tieneMinuscula = /[a-z]/.test(password);
        const tieneMayuscula = /[A-Z]/.test(password);
        const tieneNumero = /[0-9]/.test(password);
        const tieneEspecial = /[!@#$%^&*]/.test(password);
        const longitudMinima = password.length >= 8;

        return {
            valido: longitudMinima && tieneMinuscula && tieneMayuscula && tieneNumero && tieneEspecial,
            mensaje: 'La contraseña debe cumplir todos los requisitos'
        };
    },
    nombre: (nombre) => {
        const re = /^[A-Za-zÀ-ÿ\s]{2,}$/;
        return {
            valido: re.test(nombre),
            mensaje: 'El nombre solo debe contener letras y tener al menos 2 caracteres'
        };
    }
};

// Función para verificar requisitos individuales de contraseña
function checkPasswordRequirement(password) {
    return {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*?]/.test(password)
    };
}

// Función para actualizar el estado visual de los requisitos
function updateRequirements(password) {
    const requirements = checkPasswordRequirement(password);
    const requirementElements = document.querySelectorAll('.requirement');

    requirementElements.forEach(element => {
        const requirement = element.dataset.requirement;
        const wasValid = element.classList.contains('valid');
        
        if (requirements[requirement]) {
            element.classList.add('valid');
            if (!wasValid) {
                element.classList.add('just-valid');
                setTimeout(() => {
                    element.classList.remove('just-valid');
                }, 300);
            }
        } else {
            element.classList.remove('valid');
        }
    });
}

// Función para mostrar mensajes
function mostrarMensaje(mensaje, tipo) {
    const mensajeContainer = document.getElementById('mensajeContainer');
    mensajeContainer.textContent = mensaje;
    mensajeContainer.className = `mensaje mensaje-${tipo}`;
    mensajeContainer.style.display = 'block';

    setTimeout(() => {
        mensajeContainer.style.display = 'none';
    }, 5000);
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

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    setupPasswordToggle();
    updateRequirements(document.getElementById('registerPassword').value);
    
    // Validación en tiempo real de la contraseña
    document.getElementById('registerPassword').addEventListener('input', function() {
        updateRequirements(this.value);
    });
});

// Manejador del formulario de registro
document.getElementById('registerButton').addEventListener('click', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const nombres = document.getElementById('nombres').value.trim();
    const apellidoPaterno = document.getElementById('apellidoPaterno').value.trim();
    const apellidoMaterno = document.getElementById('apellidoMaterno').value.trim();

    // Validaciones
    if (!email || !password || !confirmPassword || !nombres || !apellidoPaterno || !apellidoMaterno) {
        mostrarMensaje('Por favor, completa todos los campos', 'error');
        return;
    }

    const validacionEmail = validaciones.email(email);
    if (!validacionEmail.valido) {
        mostrarMensaje(validacionEmail.mensaje, 'error');
        return;
    }

    const validacionPassword = validaciones.password(password);
    if (!validacionPassword.valido) {
        mostrarMensaje(validacionPassword.mensaje, 'error');
        return;
    }

    if (password !== confirmPassword) {
        mostrarMensaje('Las contraseñas no coinciden', 'error');
        return;
    }

    // Validar nombres
    const camposNombre = [
        { valor: nombres, nombre: 'Nombres' },
        { valor: apellidoPaterno, nombre: 'Apellido Paterno' },
        { valor: apellidoMaterno, nombre: 'Apellido Materno' }
    ];

    for (const campo of camposNombre) {
        const validacionNombre = validaciones.nombre(campo.valor);
        if (!validacionNombre.valido) {
            mostrarMensaje(`${campo.nombre}: ${validacionNombre.mensaje}`, 'error');
            return;
        }
    }

    try {
        const fullName = `${apellidoPaterno} ${apellidoMaterno} ${nombres}`;
        const response = await fetch(`${config.API_URL}/crear_usuario`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                confirm_password: confirmPassword,
                name: `${apellidoPaterno} ${apellidoMaterno} ${nombres}`,
                role: "user",
                register_date: new Date().toISOString().split('T')[0],
                status: "true"
            })
        });

        const data = await response.json();

        if (response.ok) {
            mostrarMensaje('Registro exitoso. Redirigiendo...', 'exito');
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 2000);
        } else {
            mostrarMensaje(data.detail || 'Error al registrar usuario', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error al conectar con el servidor', 'error');
    }
});
