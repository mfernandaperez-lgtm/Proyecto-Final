const productosES = {
  1: {
    title: "Maleta clásica de viaje",
    description: "Maleta clásica con múltiples compartimentos. Ideal para organizar tus pertenencias."
  },
  2: {
    title: "Camiseta deportiva slim fit para hombre",
    description: "Diseño ajustado que realza la figura. Tela ligera que permite libertad total de movimiento."
  },
  3: {
    title: "Chaqueta con cierre frontal de hombre",
    description: "Chaqueta abrigada con cierre completo y capucha. Ideal para días fríos sin perder estilo."
  },
  4: {
    title: "Sudadera acolchada de invierno para hombre",
    description: "Sudadera térmica acolchada con bolsillos funcionales. Mantiene el calor en climas fríos."
  },
  5: {
    title: "Pulsera de plata esterlina ajustable",
    description: "Pulsera elegante con acabado brillante. Ideal para ocasiones especiales o uso diario."
  },
  6: {
    title: "Pulsera de oro macizo 14k",
    description: "Pulsera minimalista de oro 14k. Ajustable y perfecta para cualquier outfit."
  },
  7: {
    title: "Collar de plata con colgante",
    description: "Collar delicado con colgante decorativo. Ideal para complementar tu estilo diario."
  },
  8: {
    title: "Pendientes de oro amarillo 14k",
    description: "Pendientes clásicos de oro amarillo. Elegantes y discretos."
  },
  9: {
    title: "Laptop ultraliviana de alto rendimiento",
    description: "Portátil ligera, poderosa y con batería duradera. Perfecta para trabajo o estudio."
  },
  10: {
    title: "Control inalámbrico Bluetooth para juegos",
    description: "Mando ergonómico con conexión estable. Ideal para largas sesiones de juego."
  },
  11: {
    title: "Mouse inalámbrico de alta precisión",
    description: "Mouse cómodo y preciso para trabajo, estudio o diseño."
  },
  12: {
    title: "Altavoz portátil Bluetooth resistente al agua",
    description: "Bocina con sonido potente y diseño resistente al agua. Perfecta para exteriores."
  },
  13: {
    title: "Computadora portátil ultraligera de alto rendimiento",
    description: "Portátil ligera, poderosa y con batería duradera. Perfecta para trabajo o estudio."
  },
  14: {
    title: "Televisor LED 4K de 55 pulgadas",
    description: "Pantalla grande con resolución 4K. Ideal para cine en casa y videojuegos."
  },
  15: {
    title: "Sudadera oversize de mujer con capucha",
    description: "Sudadera amplia y cómoda. Ideal para días relajados o clima fresco."
  },
  16: {
    title: "Chaqueta casual ligera para mujer",
    description: "Chaqueta ligera para primavera u otoño. Combina estilo y comodidad."
  },
  17: {
    title: "Gabán de mujer elegante",
    description: "Gabán elegante y cálido. Perfecto para ocasiones formales o casuales."
  },
  18: {
    title: "Blusa de mujer con diseño delicado",
    description: "Blusa con detalles finos, ideales para eventos especiales o looks elegantes."
  },
  19: {
    title: "Camisa larga de mujer",
    description: "Camisa con dijes brillantes que aportan un toque femenino y delicado."
  },
  20: {
    title: "Blusa, tenis y bolsa casual de mujer",
    description: "Blusa clásica morada combinada con tenis blancos y bolsa a juego con el outfit."
  }
};

const $ = s => document.querySelector(s);


function iniciarLogin() {
  const loginForm = $("#login-form");
  const userInfo = $("#user-info");
  const userNameText = $("#user-name");

  // Si hay sesión guardada
  const usuarioGuardado = localStorage.getItem("usuario");
  if (usuarioGuardado) {
    loginForm.classList.add("hidden");
    userInfo.classList.remove("hidden");
    userNameText.textContent = usuarioGuardado;
  }

  loginForm.addEventListener("submit", async e => {
    e.preventDefault();

    // IDs CORRECTOS
    const username = $("#username").value.trim();
    const password = $("#password").value.trim();

    if (!username || !password) {
      alert("Completa ambos campos");
      return;
    }

    try {
      const res = await fetch("https://fakestoreapi.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (data && data.token) {
        // Guardar sesión
        localStorage.setItem("usuario", username);

        loginForm.classList.add("hidden");
        userInfo.classList.remove("hidden");
        userNameText.textContent = username;

        alert("Inicio de sesión exitoso");
        return;
      }

      // Si la API responde sin token, intentamos un fallback local (modo demo)
      if (username === 'mor_2314' && password === '83r5^_') {
        localStorage.setItem("usuario", username);
        loginForm.classList.add("hidden");
        userInfo.classList.remove("hidden");
        userNameText.textContent = username;
        alert("Inicio de sesión exitoso (modo demo)");
        return;
      }

      alert("Usuario o contraseña incorrectos.");

    } catch (err) {
      // Error de red o CORS -> permitir modo demo con credenciales de ejemplo
      if (username === 'mor_2314' && password === '83r5^_') {
        localStorage.setItem("usuario", username);
        loginForm.classList.add("hidden");
        userInfo.classList.remove("hidden");
        userNameText.textContent = username;
        alert("Inicio de sesión exitoso (modo offline)");
        return;
      }

      alert("Error al conectar con la API. Usa las credenciales de ejemplo: mor_2314 / 83r5^_");
    }
  });

  $("#logout-btn").addEventListener("click", () => {
    localStorage.removeItem("usuario");
    userInfo.classList.add("hidden");
    $("#login-form").classList.remove("hidden");
  });
}


async function cargarProductos() {
  const contenedor = $("#catalogo-productos");

  const res = await fetch("https://fakestoreapi.com/products");
  const productos = await res.json();

  productos.forEach(producto => {
    if (productosES[producto.id]) {
      producto.title = productosES[producto.id].title;
      producto.description = productosES[producto.id].description;
    }

    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${producto.image}">
      <h3>${producto.title}</h3>
      <p>${producto.description}</p>
      <div class="meta">
        <strong>$${producto.price}</strong>
        <button class="btn btn-primary agregar-btn"
          data-id="${producto.id}"
          data-title="${producto.title}"
          data-price="${producto.price}"
          data-image="${producto.image}">
          Añadir al carrito
        </button>
      </div>
    `;

    contenedor.appendChild(card);
  });
}


const carrito = [];

function iniciarCarrito() {
  $("#catalogo-productos").addEventListener("click", e => {
    if (!e.target.classList.contains("agregar-btn")) return;

    const nuevo = {
      id: e.target.dataset.id,
      title: e.target.dataset.title,
      price: Number(e.target.dataset.price),
      image: e.target.dataset.image,
      cantidad: 1
    };

    const repetido = carrito.find(i => i.id === nuevo.id);
    if (repetido) repetido.cantidad++;
    else carrito.push(nuevo);

    actualizarCarrito();
  });

  $("#vaciar-carrito").addEventListener("click", () => {
    carrito.length = 0;
    actualizarCarrito();
  });
}

function actualizarCarrito() {
  const lista = $("#carrito-items");
  lista.innerHTML = "";

  let total = 0;

  carrito.forEach(item => {
    total += item.price * item.cantidad;

    const fila = document.createElement("div");
    fila.classList.add("carrito-item");

    fila.innerHTML = `
      <img src="${item.image}">
      <span>${item.title} x${item.cantidad}</span>
      <strong>$${(item.price * item.cantidad).toFixed(2)}</strong>
    `;

    lista.appendChild(fila);
  });

  $("#carrito-total").textContent = `Total: $${total.toFixed(2)}`;
}


document.addEventListener("DOMContentLoaded", () => {
  iniciarLogin();
  cargarProductos();
  iniciarCarrito();
});


