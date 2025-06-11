let carrito = JSON.parse(localStorage.getItem("carrito"));
let whatsAppButton = document.getElementById("whatsAppButton");
let formularioEnvioDatos = document.getElementById("formularioEnvioDatos");

if (carrito == null) {
  window.location.replace("./index.html");
} else {
  renderizarCarrito();
}

// Actualiza la visualización del carrito en la página, mostrando la lista de productos añadidos con su cantidad y precio total
// Calcula el importe total de todos los productos para mostrarlo en el resumen
function renderizarCarrito() {
  let contenedor = document.getElementById("carritoItems");
  let totalSpan = document.getElementById("carritoTotal");

  if (!contenedor || !totalSpan) return;

  contenedor.innerHTML = "";
  let total = 0;

  for (let producto of carrito) {
    total += producto.price * producto.quantity;

    let item = document.createElement("li");
    item.className =
      "list-group-item d-flex justify-content-between align-items-center";

    item.innerHTML = `
            <div>
                <h6 class="my-0">${producto.title}</h6>
                <small class="text-muted">Cantidad: ${producto.quantity}</small>
            </div>
            <div>
                <span class="text-muted me-2">$${(
                  producto.price * producto.quantity
                ).toFixed(2)}</span>
            </div>
        `;
    contenedor.appendChild(item);
  }

  totalSpan.textContent = `$${total.toFixed(2)}`;
}

// Maneja el envío del formulario de envío de datos a WhatsApp
formularioEnvioDatos.onsubmit = (e) => {
  // Previene el envío por defecto del formulario
  e.preventDefault();

  // Obtiene los datos del formulario
  let formData = new FormData(formularioEnvioDatos);
  let datosFormulario = Object.fromEntries(formData.entries());

  // Validaciones
  const nameRegex = /^[A-Za-z\s]+$/;
  const phoneRegex = /^\+?\d[\d\s]{7,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!nameRegex.test(datosFormulario.name)) {
    Swal.fire({
      title: "Invalid name",
      icon: "warning",
      text: "Please enter a valid name (letters and spaces only)",
    });
    return;
  }

  if (!phoneRegex.test(datosFormulario.phone)) {
    Swal.fire({
      title: "Invalid name",
      icon: "warning",
      text: "Please enter a valid phone number",
    });
    return;
  }

  if (!emailRegex.test(datosFormulario.mail)) {
    Swal.fire({
      title: "Invalid email",
      icon: "warning",
      text: "Please enter a valid email address",
    });
    return;
  }

  console.log(datosFormulario);

  const { DateTime } = luxon;

  // Calcula fecha estimada de entrega (2 días después del pedido)
  const fechaEntrega = DateTime.now().plus({ days: 2 }).toLocaleString(DateTime.DATE_FULL);

  // Construye el mensaje de WhatsApp
  let mensaje = `Order Summary\n\n`;
  mensaje += `Name: ${datosFormulario.name}\n`;
  mensaje += `Phone: ${datosFormulario.phone}\n`;
  mensaje += `Email: ${datosFormulario.mail}\n\n`;
  mensaje += `Items:\n`;

  let total = 0;

  for (let producto of carrito) {
    let subtotal = producto.price * producto.quantity;
    total += subtotal;
    mensaje += `• ${producto.title} x${producto.quantity} - $${subtotal.toFixed(
      2
    )}\n`;
  }

  mensaje += `\nTotal: $${total.toFixed(2)}`;
  mensaje += `\nEstimated delivery: ${fechaEntrega}`;

  // Codifica el mensaje para URL
  let mensajeCodificado = encodeURIComponent(mensaje);

  // Crea la URL para abrir WhatsApp
  let urlWhatsApp = `https://wa.me/?text=${mensajeCodificado}`;

  // Abre WhatsApp en una nueva pestaña
  window.open(urlWhatsApp, "_blank");
};
