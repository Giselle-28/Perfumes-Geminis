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


// js que realice para carrito nav , y link producto 

let productos = [];
let total = 0;

function agregarProducto(nombre, precio) {
  productos.push({ nombre, precio });
  actualizarCarrito();
}

function eliminarProducto(index) {
  productos.splice(index, 1);
  actualizarCarrito();
}

function actualizarCarrito() {
  const lista = document.getElementById("lista-productos");
  lista.innerHTML = "";

  total = productos.reduce((sum, p) => sum + p.precio, 0);

  productos.forEach((item, index) => {
    const p = document.createElement("p");
    p.innerHTML = `${item.nombre} - $${item.precio.toFixed(2)} 
    <button onclick="eliminarProducto(${index})">X</button>`;
    lista.appendChild(p);
  });

  document.getElementById("total").textContent = `$${total.toFixed(2)}`;
}

function toggleCarrito() {
  const panel = document.getElementById("carrito-panel");
  panel.classList.toggle("abierto");
  panel.classList.toggle("oculto");
}

function enviarWhatsApp() {
  if (productos.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  let mensaje = "Hola, quiero comprar:\n";
  productos.forEach((p, i) => {
    mensaje += `${i + 1}. ${p.nombre} - $${p.precio}\n`;
  });
  mensaje += `\nTotal: $${total.toFixed(2)}`;

  const url = `https://wa.me/5491112345678?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}

document.addEventListener("DOMContentLoaded", () => {
  // Activar el menú "Carrito"
  const linkCarrito = document.querySelector('.menu a[href="#carrito"]');
  if (linkCarrito) {
    linkCarrito.addEventListener("click", (e) => {
      e.preventDefault();
      toggleCarrito();
    });
  }

  // Activar botones "Agregar al carrito"
  const botones = document.querySelectorAll(".producto button");
  botones.forEach((btn) => {
    btn.addEventListener("click", () => {
      const producto = btn.closest(".producto");
      const nombre = producto.querySelector("h3").textContent;
      const precio = parseFloat(producto.querySelector("p").textContent.replace("$", ""));
      agregarProducto(nombre, precio);
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const enlaceProducto = document.querySelector('a[href="#producto"]');

  if (enlaceProducto) {
    enlaceProducto.addEventListener("click", function (e) {
      e.preventDefault(); // Evita el comportamiento por defecto
      const seccionProductos = document.getElementById("productos");

      if (seccionProductos) {
        seccionProductos.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
});

