let carrito = [];

// Añadir producto al carrito
function anyadirObjeto(producto){
    let existente = carrito.find((p) => p.id === producto.id);
    if (existente) {
        existente.quantity++;
    } else {
        let productoCopia = { ...producto, quantity: 1 };
        carrito.push(productoCopia);
    }
    notificar(`El producto ${producto.title} ha sido añadido al carro`);
    actualizarContador();
    renderizarCarrito();
    console.log(carrito);
}

// Eliminar un producto del carrito
function eliminarObjeto(id){
    carrito = carrito.filter(producto => producto.id !== id);
    notificar(`Producto eliminado del carrito`);
    actualizarContador();
    renderizarCarrito();
}

// Vaciar todo el carrito
function vaciarCarrito() {
    carrito = [];
    notificar("Carrito vaciado");
    actualizarContador();
    renderizarCarrito();
}

// Conectar botón vaciarCarrito
document.addEventListener("DOMContentLoaded", () => {
    const botonVaciar = document.getElementById("vaciarCarrito");
    if (botonVaciar) {
        botonVaciar.addEventListener("click", vaciarCarrito);
    }
});

// Actualizar el número que aparece en el ícono del carrito
function actualizarContador() {
    let total = carrito.reduce((acc, prod) => acc + prod.quantity, 0);
    let contador = document.getElementById("contadorCarrito");
    if (contador) {
        contador.textContent = total;
    }
}

// Renderizar los productos dentro del carrito
function renderizarCarrito() {
    let contenedor = document.getElementById("carritoItems");
    let totalSpan = document.getElementById("carritoTotal");

    if (!contenedor || !totalSpan) return;

    contenedor.innerHTML = "";
    let total = 0;

    for (let producto of carrito) {
        total += producto.price * producto.quantity;

        let item = document.createElement("li");
        item.className = "list-group-item d-flex justify-content-between align-items-center";

        item.innerHTML = `
            <div>
                <h6 class="my-0">${producto.title}</h6>
                <small class="text-muted">Cantidad: ${producto.quantity}</small>
            </div>
            <div>
                <span class="text-muted me-2">$${(producto.price * producto.quantity).toFixed(2)}</span>
                <button class="btn btn-sm btn-danger" onclick="eliminarObjeto(${producto.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
        contenedor.appendChild(item);
    }

    totalSpan.textContent = `$${total.toFixed(2)}`;
}

// Mostrar mensaje
function notificar(mensaje){
    alert(mensaje);
}
