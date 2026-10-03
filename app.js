const API = 'https://jsonplaceholder.typicode.com/users';

const lista = document.getElementById('lista');
const mensaje = document.getElementById('mensaje');
const estado = document.getElementById('estado');

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log('Service Worker registrado'))
            .catch(err => console.log('No se pudo registrar el Service Worker', err));
    });
}

async function mostrarEstado() {
    try {
        await fetch(API, { method: 'HEAD', mode: 'no-cors', cache: 'no-store' });
        estado.textContent = 'Con conexión';
    } catch (error) {
        estado.textContent = 'Sin conexión';
    }
}

window.addEventListener('online', mostrarEstado);
window.addEventListener('offline', mostrarEstado);
setInterval(mostrarEstado, 5000);
mostrarEstado();

async function cargarUsuarios() {
    try {
        const res = await fetch(API);
        if (!res.ok) throw new Error('Error en la respuesta');
        const usuarios = await res.json();

        mensaje.hidden = true;
        lista.innerHTML = usuarios.map(u => `
      <li class="tarjeta">
        <h2>${u.name}</h2>
        <p>${u.email}</p>
        <p>${u.company.name}</p>
        <p>${u.address.city}</p>
      </li>
    `).join('');
    } catch (error) {
        mensaje.textContent = 'No se pudieron cargar los datos. Abre la app con internet al menos una vez.';
    }
}

cargarUsuarios();