let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

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
  localStorage.setItem('carrito', JSON.stringify(carrito));
  mostrarToast();
  actualizarCarrito(); // Actualizamos el carrito en todos los lugares
}

function mostrarToast() {
  const toast = document.getElementById('toast');
  toast.style.display = 'block';
  setTimeout(() => toast.style.display = 'none', 2000);
}

function actualizarCarrito() {
  actualizarModalCarrito();
  actualizarCarritoNav();
  actualizarBotonVerPedido();
}

function actualizarModalCarrito() {
  const lista = document.getElementById('lista-carrito');
  const totalElem = document.getElementById('total-carrito');
  if (!lista || !totalElem) return;
  
  lista.innerHTML = '';
  let total = 0;
  
  carrito.forEach((p, index) => {
    const item = document.createElement('li');
    item.className = 'list-group-item d-flex justify-content-between align-items-center';
    item.innerHTML = `
      <div>
        <strong>${p.nombre}</strong> - $${p.precio} x 
        <input type="number" min="1" value="${p.cantidad}" onchange="cambiarCantidad(${index}, this.value)" style="width:60px;">
      </div>
      <button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito(${index})">Eliminar</button>
    `;
    lista.appendChild(item);
    total += p.precio * p.cantidad;
  });
  
  totalElem.textContent = total;
}

function cambiarCantidad(index, cantidad) {
  carrito[index].cantidad = parseInt(cantidad);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarCarrito();
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarCarrito();
}

function actualizarCarritoNav() {
  const carritoFlotante = document.getElementById('ver-carrito');
  const totalElem = document.getElementById('total-carrito');
  let total = 0;
  carrito.forEach(p => total += p.precio * p.cantidad);
  carritoFlotante.textContent = `Ver Pedido 🛒 (${carrito.length})`;
}

function actualizarBotonVerPedido() {
  const verPedidoBtn = document.getElementById("verPedidoBtn");
  verPedidoBtn.textContent = `👜 Ver Pedido (${carrito.length})`;
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

// Modal "Ver Pedido"
const verPedidoBtn = document.getElementById("verPedidoBtn");
const pedidoModal = document.getElementById("pedidoModal");
const listaPedido = document.getElementById("listaPedido");
const totalPedido = document.getElementById("totalPedido");
const mensajeVacio = document.getElementById("mensajeVacio");

verPedidoBtn.onclick = () => {
  mostrarPedido();
  pedidoModal.style.display = pedidoModal.style.display === "none" ? "block" : "none";
};

function mostrarPedido() {
  listaPedido.innerHTML = "";
  let total = 0;
  if (carrito.length === 0) {
    mensajeVacio.style.display = "block";
    totalPedido.textContent = "";
  } else {
    mensajeVacio.style.display = "none";
    carrito.forEach((item, index) => {
      total += item.precio * item.cantidad;
      const li = document.createElement("li");
      li.innerHTML = `
        ${item.nombre} - $${item.precio} 
        <input type="number" value="${item.cantidad}" onchange="modificarCantidad(${index}, this.value)" style="width: 50px; margin: 0 5px;" />
        <button onclick="eliminarDelCarrito(${index})">❌</button>
      `;
      listaPedido.appendChild(li);
    });
    totalPedido.textContent = `Total: $${total}`;
  }
}

function modificarCantidad(index, nuevaCantidad) {
  carrito[index].cantidad = parseInt(nuevaCantidad);
  actualizarCarrito();
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

function enviarPedido() {
  if (carrito.length === 0) return;
  let mensaje = "Hola, quiero realizar el siguiente pedido:%0A";
  carrito.forEach(item => {
    mensaje += `- ${item.nombre} x${item.cantidad} ($${item.precio * item.cantidad})%0A`;
  });
  const url = `https://wa.me/1234567890?text=${mensaje}`;
  window.open(url, "_blank");
}

function seguirComprando() {
  pedidoModal.style.display = "none";
}

window.onload = () => {
  cargarProductos();
  actualizarCarrito();  // Asegura que todo se cargue correctamente al iniciar
};
