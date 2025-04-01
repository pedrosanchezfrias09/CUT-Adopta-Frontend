// js/config.js
const config = {
    API_URL: 'https://pedrocutadopta.onrender.com'
};

// ya que utilizamos el servicio de render gratutio para el backend, es necesario hacer un ping cada cierto tiempo para evitar que se duerma
// Ping al backend cada 5 minutos
setInterval(() => {
    fetch('https://pedrocutadopta.onrender.com/login')
        .then(res => console.log('Ping exitoso:', res.status))
        .catch(err => console.error('Error en ping:', err));
}, 300000); // Cada 5 minutos (300,000 ms)

setInterval(() => {
    fetch('https://cut-adopta-backend-perritos.onrender.com/SubirPerro')
        .then(res => console.log('Ping exitoso:', res.status))
        .catch(err => console.error('Error en ping:', err));
}, 300000); // Cada 5 minutos (300,000 ms)
