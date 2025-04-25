let carrito = [];

async function cargarProductos(filtro = "todos") {
  const respuesta = await fetch('productos.json');
  const productos = await respuesta.json();
  const contenedor = document.getElementById('products-container');
  contenedor.innerHTML = '';
  productos
    .filter(p => filtro === "todos" || p.tipo === filtro)
    .forEach(p => {
      const div = document.createElement('div');
      div.className = 'product';
      div.innerHTML = `
        <img src="${p.imagen}" alt="${p.nombre}" />
        <h3>${p.nombre}</h3>
        <p>$${p.precio}</p>
        <button onclick="agregarAlCarrito('${p.nombre}', ${p.precio})">Agregar al carrito</button>
      `;
      contenedor.appendChild(div);
    });
}

function filtrarCategoria(tipo) {
  cargarProductos(tipo);
}

function agregarAlCarrito(nombre, precio) {
  const existente = carrito.find(p => p.nombre === nombre);
  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }
  mostrarToast();
  document.getElementById('ver-carrito').style.display = 'block';
}

function mostrarToast() {
  const toast = document.getElementById('toast');
  toast.style.display = 'block';
  setTimeout(() => toast.style.display = 'none', 2000);
}

function enviarWhatsApp() {
  if (carrito.length === 0) return alert('Tu carrito está vacío');
  let mensaje = "¡Hola! Me interesa realizar el siguiente pedido:%0A";
  let total = 0;
  carrito.forEach(p => {
    mensaje += `🧴 ${p.nombre} x${p.cantidad} = $${p.precio * p.cantidad}%0A`;
    total += p.precio * p.cantidad;
  });
  mensaje += `%0A----------------------------%0ATotal: $${total}`;
  window.open(`https://wa.me/5491112345678?text=${mensaje}`, '_blank');
}

window.onload = () => cargarProductos();
