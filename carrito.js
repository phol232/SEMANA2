document.addEventListener('DOMContentLoaded', () => {
  const carritoBtn = document.getElementById('carrito-btn');
  const carritoContainer = document.getElementById('carrito-container');
  const carritoOverlay = document.getElementById('carrito-overlay');
  const cerrarCarritoBtn = document.getElementById('cerrar-carrito');
  const carritoProductos = document.getElementById('carrito-productos');
  const contadorCarrito = document.getElementById('contador-carrito');
  const carritoTotal = document.getElementById('carrito-total');
  const botonesAgregar = document.querySelectorAll('.agregar-carrito');

  let carrito = [];

  carritoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    mostrarCarrito();
  });

  cerrarCarritoBtn.addEventListener('click', () => {
    ocultarCarrito();
  });

  carritoOverlay.addEventListener('click', () => {
    ocultarCarrito();
  });

  botonesAgregar.forEach(boton => {
    boton.addEventListener('click', agregarAlCarrito);
  });

  function mostrarCarrito() {
    carritoContainer.classList.add('active');
    carritoOverlay.classList.add('active');
  }
  
  function ocultarCarrito() {
    carritoContainer.classList.remove('active');
    carritoOverlay.classList.remove('active');
  }
  
  function agregarAlCarrito(e) {
    const boton = e.target;
    const card = boton.closest('.card');
    const id = card.dataset.id;
    const imagen = card.querySelector('img').getAttribute('src');
    const nombre = card.querySelector('h3').textContent;
    const precioText = card.querySelector('.precio').textContent;
    const precio = parseFloat(precioText.replace('S/', ''));
    const productoExistente = carrito.find(item => item.id === id);  
    
    if (productoExistente) {
      productoExistente.cantidad++;
    } else {
      carrito.push({
        id,
        imagen,
        nombre,
        precio,
        cantidad: 1
      });
    }
    actualizarCarrito();
    mostrarCarrito();
  }
  
  function actualizarCarrito() {
    carritoProductos.innerHTML = '';
    
    if (carrito.length === 0) {
      carritoProductos.innerHTML = '<div class="carrito-vacio">No hay productos en el carrito</div>';
    } else {
      carrito.forEach(producto => {
        const carritoItem = document.createElement('div');
        carritoItem.classList.add('carrito-item');
        carritoItem.dataset.id = producto.id;
        
        carritoItem.innerHTML = `
          <img src="${producto.imagen}" alt="${producto.nombre}">
          <div class="carrito-item-info">
            <div class="carrito-item-nombre">${producto.nombre}</div>
            <div class="carrito-item-precio">S/${producto.precio.toFixed(2)}</div>
            <div class="carrito-item-cantidad">
              <button class="btn-restar">-</button>
              <span>${producto.cantidad}</span>
              <button class="btn-sumar">+</button>
            </div>
          </div>
          <button class="carrito-item-eliminar"><i class="fas fa-trash"></i></button>
        `;
        
        carritoProductos.appendChild(carritoItem);
        carritoItem.querySelector('.btn-restar').addEventListener('click', () => {
          restarCantidad(producto.id);
        });
        
        carritoItem.querySelector('.btn-sumar').addEventListener('click', () => {
          sumarCantidad(producto.id);
        });
        
        carritoItem.querySelector('.carrito-item-eliminar').addEventListener('click', () => {
          eliminarProducto(producto.id);
        });
      });
    }
    actualizarContadorYTotal();
  }
  
  function restarCantidad(id) {
    const producto = carrito.find(item => item.id === id);
    
    if (producto) {
      producto.cantidad--;
      
      if (producto.cantidad <= 0) {
        eliminarProducto(id);
      } else {
        actualizarCarrito();
      }
    }
  }
  
  function sumarCantidad(id) {
    const producto = carrito.find(item => item.id === id);
    
    if (producto) {
      producto.cantidad++;
      actualizarCarrito();
    }
  }
  
  function eliminarProducto(id) {
    carrito = carrito.filter(item => item.id !== id);
    actualizarCarrito();
  }
  
  function actualizarContadorYTotal() {
    const cantidadTotal = carrito.reduce((total, producto) => total + producto.cantidad, 0);
    const precioTotal = carrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
    contadorCarrito.textContent = cantidadTotal;
    carritoTotal.textContent = `S/${precioTotal.toFixed(2)}`;
  }
});