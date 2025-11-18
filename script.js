const productosES = {
  1: {
    title: "Maleta Clasica de viaje ",
    description: "Maleta clásica de viaje con compartimentos múltiples. Ideal para organizar tus pertenencias."
  },
  2: {
    title: "Camiseta deportiva slim fit para hombre",
    description: "Diseño ajustado que resalta la figura. Tela ligera que permite libertad total de movimiento."
  },
  3: {
    title: "Chaqueta con cierre frontal de hombre",
    description: "Chaqueta abrigada con cierre completo y capucha ajustable. Ideal para días fríos sin perder estilo."
  },
  4: {
    title: "Sudadera acolchada de invierno para hombre",
    description: "Sudadera térmica acolchada con bolsillos funcionales. Mantiene el calor en climas fríos."
  },
  5: {
    title: "Pulsera de plata esterlina ajustable",
    description: "Pulsera elegante y brillante de plata esterlina. Un accesorio minimalista y elegante, elaborada en plata 925. Ajustable y combinable con cualquier outfit para ocasiones especiales."
  },
  6: {
    title: "Pulsera de Anillo de oro macizo 14k",
    description: "Pulsera minimalista y elegante, elaborada en oro macizo 14k. Ajustable y combinable con cualquier outfit."
  },
  7: {
    title: "Collar de plata con colgante",
    description: "Collar delicado con un colgante decorativo. Una pieza ideal para complementar tu estilo diario."
  },
  8: {
    title: "Pendientes de oro amarillo 14k",
    description: "Pendientes clásicos de oro amarillo, ideales para un look discreto y sofisticado."
  },
  9: {
    title: "Laptop ultraliviana de alto rendimiento",
    description: "Portátil ligera y poderosa con batería de larga duración. Perfecta para trabajo o estudio."
  },
  10: {
    title: "Control inalámbrico Bluetooth para juegos",
    description: "Mando ergonómico con conexión estable. Ideal para sesiones de juego prolongadas."
  },
  11: {
    title: "Mouse inalámbrico de alta precisión",
    description: "Mouse cómodo y preciso para tareas de oficina, estudio o diseño. Ligero y fácil de usar."
  },
  12: {
    title: "Altavoz portátil Bluetooth resistente al agua",
    description: "Bocina portátil con sonido claro y potente. Resistente al agua, perfecta para exteriores."
  },
  13: {
    title: "Camiseta básica de mujer de algodón",
    description: "Prenda suave y ligera, ideal para el día a día. Versátil, cómoda y fácil de combinar."
  },
  14: {
    title: "Blusa elegante de mujer con diseño moderno",
    description: "Blusa fresca y sofisticada. Perfecta para reuniones, eventos o un look casual elegante."
  },
  15: {
    title: "Sudadera oversize de mujer con capucha",
    description: "Sudadera amplia y cómoda con estilo moderno. Ideal para climas frescos y días relajados."
  },
  16: {
    title: "Chaqueta casual ligera para mujer",
    description: "Chaqueta ligera perfecta para primavera u otoño. Combina estilo y comodidad."
  },
  17: {
    title: "Anillo ajustable de plata esterlina",
    description: "Anillo delicado con brillo sutil. Ajustable para adaptarse a cualquier tamaño."
  },
  18: {
    title: "Aretes de plata con diseño artístico",
    description: "Aretes elegantes con detalles finos. Ideales para eventos especiales o looks formales."
  },
  19: {
    title: "Collar de oro 14k con dijes decorativos",
    description: "Collar de oro con dijes brillantes que aportan un toque femenino y delicado."
  },
  20: {
    title: "Pulsera elegante bañada en oro",
    description: "Pulsera bañada en oro con acabado brillante. Perfecta para complementar outfits elegantes."
  }
};

// -------------------------------------------------------
// SELECTORES
// -------------------------------------------------------
const API_PRODUCTS = 'https://fakestoreapi.com/products';
const API_LOGIN = 'https://fakestoreapi.com/auth/login';

const $ = s => document.querySelector(s);

// -------------------------------------------------------
// UTILIDADES
// -------------------------------------------------------
function formatCurrency(n) {
  return '$' + Number(n).toFixed(2);
}

// -------------------------------------------------------
// CARRITO
// -------------------------------------------------------
const carrito = {
  items: [],

  agregarItem(producto) {
    const existe = this.items.find(i => i.id === producto.id);
    if (existe) {
      existe.cantidad++;
    } else {
      this.items.push({ ...producto, cantidad: 1 });
    }
  },

  disminuir(id) {
    const item = this.items.find(i => i.id === id);
    if (!item) return;
    item.cantidad--;
    if (item.cantidad <= 0) {
      this.items = this.items.filter(i => i.id !== id);
    }
  },

  quitarItem(id) {
    this.items = this.items.filter(i => i.id !== id);
  },

  calcularTotal() {
    return this.items.reduce((t, i) => t + i.price * i.cantidad, 0);
  },

  renderizarCarrito() {
    const cont = $('#carrito-items');
    cont.innerHTML = '';

    if (this.items.length === 0) {
      cont.innerHTML = "<p>El carrito está vacío.</p>";
      $('#carrito-total').textContent = "Total: $0.00";
      return;
    }

    this.items.forEach(it => {
      const div = document.createElement('div');
      div.className = 'carrito-item';

      div.innerHTML = `
        <img src="${it.image}" alt="">
        <div class="carrito-item-info">
          <h4>${it.title}</h4>
          <small>${it.cantidad} x ${formatCurrency(it.price)}</small>
        </div>
        <div class="carrito-item-controls">
          <button class="btn" data-id="${it.id}" data-action="add">+</button>
          <button class="btn" data-id="${it.id}" data-action="sub">-</button>
          <button class="btn" data-id="${it.id}" data-action="remove">Quitar</button>
        </div>
      `;
      cont.appendChild(div);
    });

    $('#carrito-total').textContent = "Total: " + formatCurrency(this.calcularTotal());
  }
};

// -------------------------------------------------------
// CARGAR PRODUCTOS
// -------------------------------------------------------
async function cargarProductos() {
  try {
    const resp = await fetch(API_PRODUCTS);
    const productos = await resp.json();

    const cont = $('#catalogo-productos');
    cont.innerHTML = "";

    productos.forEach(prod => {
      if (productosES[prod.id]) {
        prod.title = productosES[prod.id].title;
        prod.description = productosES[prod.id].description;
      }

      const card = document.createElement('div');
      card.className = 'card';

      card.innerHTML = `
        <img src="${prod.image}" alt="${prod.title}">
        <h3>${prod.title}</h3>
        <p>${prod.description}</p>
        <div class="meta">
          <strong>${formatCurrency(prod.price)}</strong>
          <button class="btn btn-primary add-to-cart"
            data-id="${prod.id}"
            data-title="${prod.title}"
            data-price="${prod.price}"
            data-image="${prod.image}"
            data-description="${prod.description}">
            Añadir al carrito
          </button>
        </div>
      `;

      cont.appendChild(card);
    });

  } catch (error) {
    console.error(error);
    $('#catalogo-productos').innerHTML = "<p>Error al cargar productos.</p>";
  }
}

// -------------------------------------------------------
// EVENTOS DE AÑADIR AL CARRITO
// -------------------------------------------------------
function setupCatalogo() {
  $('#catalogo-productos').addEventListener('click', e => {
    const btn = e.target.closest('.add-to-cart');
    if (!btn) return;

    const id = Number(btn.dataset.id);
    const title = btn.dataset.title;
    const price = Number(btn.dataset.price);
    const image = btn.dataset.image;
    const description = btn.dataset.description;

    carrito.agregarItem({ id, title, price, image, description });
    carrito.renderizarCarrito();
  });
}

// -------------------------------------------------------
// CONTROLES DEL CARRITO
// -------------------------------------------------------
function setupCarrito() {
  $('#carrito-items').addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const id = Number(btn.dataset.id);
    const action = btn.dataset.action;

    if (action === "add") carrito.agregarItem(carrito.items.find(i => i.id === id));
    if (action === "sub") carrito.disminuir(id);
    if (action === "remove") carrito.quitarItem(id);

    carrito.renderizarCarrito();
  });

  $('#vaciar-carrito').addEventListener('click', () => {
    carrito.items = [];
    carrito.renderizarCarrito();
  });
}

// -------------------------------------------------------
// LOGIN CORREGIDO
// -------------------------------------------------------
function setupLogin() {
  const loginForm = $('#login-form');
  const userInfo = $('#user-info');
  const userNameSpan = $('#user-name');
  const logoutBtn = $('#logout-btn');

  // Estado inicial
  const token = localStorage.getItem('auth_token');
  const usuario = localStorage.getItem('auth_user');

  if (token && usuario) {
    loginForm.classList.add('hidden');
    userInfo.classList.remove('hidden');
    userNameSpan.textContent = `Conectado: ${usuario}`;
  }

  loginForm.addEventListener('submit', async e => {
    e.preventDefault();

    // Leer campos correctamente; si están vacíos usar credenciales por defecto
    const defaultUsername = 'mafe';
    const defaultPassword = '1234';

    const usernameInput = $('#username');
    const passwordInput = $('#password');

    const username = (usernameInput && usernameInput.value.trim()) ? usernameInput.value.trim() : defaultUsername;
    const password = (passwordInput && passwordInput.value) ? passwordInput.value : defaultPassword;

    try {
      const res = await fetch(API_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!data.token) throw new Error("Credenciales incorrectas");

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', username);

      loginForm.classList.add('hidden');
      userInfo.classList.remove('hidden');
      userNameSpan.textContent = `Conectado: ${username}`;

      alert("Inicio de sesión exitoso");

    } catch (err) {
      alert("Error: " + err.message + "\nUsa el usuario de prueba: mafe / 1234");
    }
  });

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    loginForm.classList.remove('hidden');
    userInfo.classList.add('hidden');
  });
}

// -------------------------------------------------------
// INICIALIZACIÓN
// -------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
  await cargarProductos();
  setupCatalogo();
  setupCarrito();
  setupLogin();
  carrito.renderizarCarrito();
});
