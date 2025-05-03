function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  function mostrarMensaje(texto, tipo) {
    const mensaje = document.getElementById('mensajeRecuperacion');
    mensaje.textContent = texto;
    mensaje.className = `mensaje mensaje-${tipo}`;
    mensaje.style.display = 'block';
    setTimeout(() => { mensaje.style.display = 'none'; }, 5000);
  }
  
  document.getElementById('enviarRecuperacion').addEventListener('click', async () => {
    const email = document.getElementById('correoRecuperacion').value.trim();
    if (!email) return mostrarMensaje('Por favor, ingresa tu correo.', 'error');
    if (!isValidEmail(email)) return mostrarMensaje('El correo no tiene un formato válido.', 'error');
  
    try {
      const respuesta = await fetch(`${config.API_URL}/recuperar-contrasena`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await respuesta.json();
      if (respuesta.ok) {
        mostrarMensaje('Se ha enviado un correo para restablecer tu contraseña.', 'exito');
      } else {
        mostrarMensaje(data.message || data.detail || 'Error al enviar el correo.', 'error');
      }
    } catch (error) {
      console.error('Error al conectar:', error);
      mostrarMensaje('No se pudo conectar con el servidor.', 'error');
    }
  });