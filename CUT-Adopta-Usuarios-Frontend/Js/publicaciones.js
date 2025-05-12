const API_URL = 'https://publicaciones-backend.onrender.com/publicaciones';

// Mostrar/ocultar secciones
function toggleSeccion(id) {
  const secciones = ['seccion-ver', 'seccion-crear', 'seccion-buscar'];
  secciones.forEach(sec => {
    document.getElementById(sec).style.display = sec === id ? 'block' : 'none';
  });

  if (id === 'seccion-ver') cargarPublicaciones();
}

// Cargar publicaciones
async function cargarPublicaciones() {
  try {
    const res = await fetch(API_URL);
    const publicaciones = await res.json();
    const contenedor = document.getElementById('publicaciones-container');
    contenedor.innerHTML = '';

    publicaciones.forEach(pub => {
      const card = document.createElement('div');
      card.className = 'card-publicacion';
      card.innerHTML = `
        <h3>${pub.titulo}</h3>
        <p>${pub.contenido}</p>
        <small>Autor ID: ${pub.autor_id}</small>
      `;
      contenedor.appendChild(card);
    });
  } catch (error) {
    console.error("Error al cargar publicaciones:", error);
  }
}

// Crear publicación
document.getElementById('form-crear').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nuevaPub = {
    titulo: document.getElementById('titulo').value,
    contenido: document.getElementById('contenido').value,
    autor_id: parseInt(document.getElementById('autor_id').value),
  };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevaPub)
    });

    if (!res.ok) throw new Error('Error al crear publicación');
    alert('¡Publicación creada!');
    document.getElementById('form-crear').reset();
    cargarPublicaciones();
    toggleSeccion('seccion-ver');
  } catch (err) {
    console.error(err);
    alert('Error al crear publicación');
  }
});

// Buscar publicación
document.getElementById('form-buscar').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('buscar-id').value;

  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error('No encontrada');

    const pub = await res.json();
    document.getElementById('resultado-busqueda').innerHTML = `
      <div class="card-publicacion">
        <h3>${pub.titulo}</h3>
        <p>${pub.contenido}</p>
        <small>Autor ID: ${pub.autor_id}</small>
      </div>
    `;
  } catch {
    document.getElementById('resultado-busqueda').innerHTML = `<p>No se encontró la publicación.</p>`;
  }
});

