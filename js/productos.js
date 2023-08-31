const piepag = document.getElementById("telefono")
piepag.innerText = "02324-1111111"

function inscripcion(){

  Swal.fire({
    title: '¡¡¡GRACIAS POR VISITARNOS!!! Recordá que si te inscribís tendrás descuentos en la compra de los productos.',
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    }
  })
  
}
setTimeout(inscripcion,5000)
//NO FUNCIONA!!
fetch('/datos.json')
.then(response => response.json())
.then(data=> {
    const prodLimpieza = data.ProdLimpieza;

    const prodConteiner = document.getElementById("productos-container")

    prodLimpieza.forEach(producto => {
        const prodElement = document.createElement('p');
        prodElement.textContent =`Código: ${producto.codigo}, Descripcion: ${producto.descripcion}, Capacidad: ${producto.capacidad}, Precio: $ ${producto.precio},Stock: ${producto.stock},Preco_IVA: $ ${producto.precioIva}`
        prodConteiner.appendChild(prodElement);
    });        
    })
    .catch(error => {
      console.error('Ocurrió un error: ',error);
    });

// Función para calcular el precio con IVA
function calcularPrecioConIva(precioSinIva) {
    return precioSinIva * 1.21;
  }
  
  // Función para agregar un producto al local storage
  function agregarProducto(codProducto, descripcion, precioSinIva, stock) {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    let producto = {
      codProducto,
      descripcion,
      precioSinIva,
      precioConIva: calcularPrecioConIva(precioSinIva),
      stock
    };
    productos.push(producto);
    localStorage.setItem("productos", JSON.stringify(productos));
    Swal.fire("¡Producto agregado!", "El producto ha sido agregado con éxito.", "success");
  }
  
  // Función para obtener un producto del local storage por su código
  function obtenerProductoPorCodigo(codProducto) {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    return productos.find(producto => producto.codProducto === codProducto);
  }
  
  // Función para actualizar el stock de un producto en el local storage
  function actualizarStock(codProducto, cantidad) {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    let producto = productos.find(producto => producto.codProducto === codProducto);
    if (producto) {
      producto.stock -= cantidad;
      localStorage.setItem("productos", JSON.stringify(productos));
      Swal.fire("¡Producto incorporado al carrito!", "compra exitosa.", "success");
    }
  }
  
  // Función para agregar un producto al carrito de compras
  function agregarAlCarrito(codProducto, descripcion, cantidad, precioSinIva, precioConIva) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let itemCarrito = carrito.find(item => item.codProducto === codProducto);
    
    if (itemCarrito) {
      // Si el producto ya está en el carrito, actualizar la cantidad y el total
      itemCarrito.cantidad += cantidad;
      itemCarrito.total += precioConIva * cantidad;
    } else {
      // Si el producto no está en el carrito, agregarlo
      carrito.push({
        codProducto,
        descripcion,
        cantidad,
        precioSinIva,
        precioConIva,
        total: precioConIva * cantidad
      });
    }
    
    localStorage.setItem("carrito", JSON.stringify(carrito));
    Swal.fire("¡Producto agregado al carrito!", "El producto ha sido agregado al carrito.", "success");
  }
  
  // Función para mostrar el carrito de compras en la tabla
  function mostrarCarrito() {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    
    // Limpiar la tabla
    let tabla = document.getElementById("carrito");
    while (tabla.rows.length > 1) {
      tabla.deleteRow(1);
    }
    
    // Agregar los items del carrito a la tabla
    let totalCarrito = 0;
    
    for (let item of carrito) {
      let fila = tabla.insertRow();
      
      fila.insertCell().textContent = item.codProducto;
      fila.insertCell().textContent = item.descripcion;
      fila.insertCell().textContent = item.cantidad;
      fila.insertCell().textContent = item.precioSinIva;
      fila.insertCell().textContent = item.precioConIva;
      fila.insertCell().textContent = item.total;
      
      totalCarrito += item.total;
    }
    
    // Agregar una fila con el total del carrito
    let filaTotal = tabla.insertRow();
    filaTotal.insertCell().textContent = "Total";
    filaTotal.insertCell();
    filaTotal.insertCell();
    filaTotal.insertCell();
    filaTotal.insertCell();
    filaTotal.insertCell().textContent = totalCarrito;
  }
  
  // Manejar el envío del formulario para agregar productos
  document.getElementById("agregar-producto-form").addEventListener("submit", event => {
    event.preventDefault();
    
    let codProducto = document.getElementById("codProducto").value;
    let descripcion = document.getElementById("descripcion").value;
    let precioSinIva = parseFloat(document.getElementById("precioSinIva").value);
    let stock = parseInt(document.getElementById("stock").value);
    
    agregarProducto(codProducto, descripcion, precioSinIva, stock);
    //Vacío los campos para ingresar nuevos productos.
    document.getElementById("codProducto").value ="";
    document.getElementById("descripcion").value="";
    document.getElementById("precioSinIva").value="";
    document.getElementById("stock").value="";

  });
  
  // Manejar el cambio en el código del producto en el formulario para comprar productos
  document.getElementById("codProductoCompra").addEventListener("change", event => {
    let codProducto = event.target.value;
    let producto = obtenerProductoPorCodigo(codProducto);
    
    if (producto) {
      document.getElementById("descripcionCompra").textContent = producto.descripcion;
    } else {
      document.getElementById("descripcionCompra").textContent = "Producto no encontrado";
    }
  });
  
  // Manejar el envío del formulario para comprar productos
  document.getElementById("comprar-producto-form").addEventListener("submit", event => {
    event.preventDefault();
    
    let codProducto = document.getElementById("codProductoCompra").value;
    let cantidad = parseInt(document.getElementById("cantidadCompra").value);    
    let producto = obtenerProductoPorCodigo(codProducto);
    
    if (producto) {
      if (cantidad < producto.stock) {
        actualizarStock(codProducto, cantidad);
        agregarAlCarrito(codProducto, producto.descripcion, cantidad, producto.precioSinIva, producto.precioConIva);
        mostrarCarrito();
         
      } else if (cantidad > producto.stock){
        document.getElementById("descripcionCompra").textContent = "No hay suficiente stock";
        
      }
    } else {
        document.getElementById("descripcionCompra").textContent = "Producto no encontrado";
    }
  });
  