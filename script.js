// Referencias
let productosContainer = document.getElementById("productosContainer");
let botonesAnyadirCesta;
let inputBuscar = document.getElementById("inputBuscar");
let botonBuscar = document.getElementById("botonBuscar");
let botonesCategorias = {
  "men's clothing": document.getElementById("botonRopaHombre"),
  "women's clothing": document.getElementById("botonRopaMujer"),
  "jewelery": document.getElementById("botonJoyeria"),
  "electronics": document.getElementById("botonElectronica")
};

const URL = "https://fakestoreapi.com/products";
let productos = [];
let categoriaSeleccionada = null;

// Función para obtener la lista de productos de la API
function obtenerProductos() {
  fetch(URL)
    .then((respuesta) => respuesta.json())
    .then((datosJs) => {
      console.log(datosJs);
      productos = datosJs;
      renderizarProductos(productos);
      botonesAnyadirCesta = document.getElementsByClassName("boton-anyadir");
      engancharBotonesCesta();
      console.log(botonesAnyadirCesta);
    })
    .catch(error => alert(error))
    .finally(()=>console.log('Terminó la peitición asincrónica'));
}

obtenerProductos();

// Función para renderizar una lista de productos en el HTML
// Generamos el HTML de cada tarjeta de producto y lo insertamos en el contenedor
function renderizarProductos(lista) {

  productosContainer.innerHTML = "";

  for (let i = 0; i < lista.length; i++) {
    let producto = lista[i];
  
    productosContainer.innerHTML += `<div class="col">
          <div class="card h-100">
          <img src="${producto.image}" class="card-img-top p-3" alt="${producto.title}">
          <div class="card-body d-flex flex-column">
              <h5 class="card-title">${producto.title}</h5>
              <div class="accordion" id="accordionExample${producto.id}">
                <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${producto.id}" aria-expanded="true" aria-controls="collapse${producto.id}">
                  Description
                  </button>
              </h2>
              <div id="collapse${producto.id}" class="accordion-collapse collapse" data-bs-parent="#accordionExample${producto.id}">
              <div class="accordion-body">
              <p class="card-text">${producto.description}</p>
            </div>
            </div>
            </div>
          </div>    
              <p class="card-text mt-3">Price: ${producto.price}$</p>
              <p class="card-text">Category: ${producto.category}</p>
              <p class="card-text">Rating: ${producto.rating.rate}</p>
              <a href="#" class="btn btn-primary mt-auto boton-anyadir" data-id="${producto.id}">Add to cart</a>
          </div>
        </div>
    </div>`;
  }
}

function filtrarPorCategoria(categoria){
  const arrayCategoria = productos.filter(producto => producto.category === categoria);
  return arrayCategoria;
}

// Función que se llama al hacer clic en un botón de categoría
function manejarClickCategoria(categoria) {

  // Si ya está seleccionada, la deseleccionamos y mostramos todos los productos
  if (categoriaSeleccionada === categoria) {
    categoriaSeleccionada = null;
    renderizarProductos(productos);
  } else {

    // Si es una nueva selección, guardamos y filtramos
    categoriaSeleccionada = categoria;
    renderizarProductos(filtrarPorCategoria(categoria));
  }
  actualizarEstilosBotones();
}

// Función que cambia el color de los botones del offcanvas (categorías) para mostrar cuál está seleccionado
function actualizarEstilosBotones() {
  for (const [categoria, boton] of Object.entries(botonesCategorias)) {
    if (categoria === categoriaSeleccionada) {
      boton.classList.remove("btn-outline-primary");
      boton.classList.add("btn-primary");
    } else {
      boton.classList.remove("btn-primary");
      boton.classList.add("btn-outline-primary");
    }
  }
}

// Asignamos a cada botón de categoría su evento de clic
for (const [categoria, boton] of Object.entries(botonesCategorias)) {
  boton.addEventListener("click", () => manejarClickCategoria(categoria));
}


// Función para buscar productos en la tienda
function buscarProductos() {
  // Obtiene el texto del input de búsqueda, sin espacios y en minúsculas
  let texto = inputBuscar.value.trim().toLowerCase();

  // Empieza con todos los productos
  let resultados = productos;

  // Si hay una categoría seleccionada, filtramos por esa categoría primero
  if (categoriaSeleccionada) {
    resultados = resultados.filter(producto => producto.category === categoriaSeleccionada);
  }

  // Si hay texto de búsqueda, filtramos también por coincidencia con el título
  if (texto !== "") {
    resultados = resultados.filter(producto =>
      producto.title.toLowerCase().includes(texto)
    );
  }

  // Finalmente renderizamos los productos filtrados
  renderizarProductos(resultados);
}


// Asigna la función buscarProductos al botón de buscar
botonBuscar.onclick = buscarProductos;

// Permite buscar presionando la tecla "Enter" dentro del input
inputBuscar.addEventListener("keypress", (e) => {
  if (e.key === "Enter") buscarProductos();
});

function engancharBotonesCesta(){
    for (const boton of botonesAnyadirCesta){
    boton.onclick=()=>{
      const productoEncontrado = productos.find((producto) => producto.id == boton.dataset.id);
      if (productoEncontrado != undefined){
        anyadirObjeto(productoEncontrado);
      }
    }
  }
}


// Cargar contenido de carrito.html al abrir el modal
const modalCarrito = document.getElementById('modalCarrito');
modalCarrito.addEventListener('show.bs.modal', () => {
  fetch('carrito.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('modalCarritoBody').innerHTML = html;
      // Volvemos a renderizar el carrito después de insertar el HTML
      renderizarCarrito();

      // Reenganchamos el botón de vaciar carrito, ya que el DOM ha cambiado
      const botonVaciar = document.getElementById("vaciarCarrito");
      if (botonVaciar) {
        botonVaciar.addEventListener("click", vaciarCarrito);
      }

      // Reenganchamos el botón de finalizar compra
      const botonFinalizar = document.getElementById("finalizarCompra");
      if (botonFinalizar) {
        botonFinalizar.addEventListener("click", () => {
        if (carrito.length === 0) return;

        // Aquí puedes agregar lógica de confirmación o registro
        alert("¡Gracias por tu compra!");

        // Vaciar carrito y cerrar modal
        vaciarCarrito();

        const modalElement = bootstrap.Modal.getInstance(modalCarrito);
        modalElement.hide();
        });
      }
    })
    .catch(err => {
      document.getElementById('modalCarritoBody').innerHTML = `<p class="text-danger">Error al cargar el carrito.</p>`;
      console.error(err);
    });
});

