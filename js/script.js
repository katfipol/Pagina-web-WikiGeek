// MENÚ HAMBURGUESA 
document.addEventListener('DOMContentLoaded', function () {
  const menuHamburguesa = document.getElementById('menu-hamburguesa');
  const sesion = document.querySelector('.sesion');
  const inicio = document.querySelector('.inicio');

  if (menuHamburguesa && sesion && inicio) {
    menuHamburguesa.addEventListener('click', function () {
      this.classList.toggle('active');
      sesion.classList.toggle('active');
      inicio.classList.toggle('visible');
    });
  }
});

// FUNCIÓN PARA VERIFICAR SI EL USUARIO HA INICIADO SESIÓN
function estaLogueado() {
  return localStorage.getItem('usuarioAutenticado') !== null;
}

// AGREGAR A "MI LISTA" (PROTEGIDA)
function agregarAPelicula(e) {
  // Evita que un <a> recargue la página
  if (e.target.tagName === 'A') {
    e.preventDefault();
  }

  // Si no ha iniciado sesión
  if (!estaLogueado()) {
    alert('Debes iniciar sesión o registrarte para guardar películas en "Mi lista".');
    window.location.href = 'registrar.html'; // redirige a registro
    return;
  }

  // Si si está logueado, procede
  const tarjeta = e.target.closest('.tarjeta-pelicula');
  if (!tarjeta) return;

  const titulo = tarjeta.querySelector('figcaption').textContent;
  const imgSrc = tarjeta.querySelector('img').src;

  // Cargar lista actual (se usa localStorage)
  let miLista = JSON.parse(localStorage.getItem('miLista') || '[]');

  // Evitar duplicados
  const existe = miLista.some(peli => peli.titulo === titulo);
  if (existe) {
    alert('¡Ya está en tu lista!');
    return;
  }

  // Añadir película
  miLista.push({ titulo, imgSrc });
  localStorage.setItem('miLista', JSON.stringify(miLista));
  alert('¡Añadido a tu lista!');
}

// Aplicar evento a todos los botones de "Mi lista"
document.querySelectorAll('.btn-pelicula, .btn-agregarlista').forEach(boton => {
  boton.addEventListener('click', agregarAPelicula);
});

//  CARGAR "MI LISTA" EN milista.html 
if (document.getElementById('pelisguardadas')) {
  const contenedor = document.getElementById('pelisguardadas');
  const mensajeVacio = document.getElementById('mensaje-vacio');
  const miLista = JSON.parse(localStorage.getItem('miLista') || '[]');

  if (miLista.length === 0) {
    mensajeVacio.style.display = 'block';
  } else {
    mensajeVacio.style.display = 'none';
    contenedor.innerHTML = '';
    miLista.forEach(peli => {
      const figure = document.createElement('figure');
      figure.className = 'tarjeta-pelicula';
      figure.innerHTML = `
        <img src="${peli.imgSrc}" alt="${peli.titulo}">
        <figcaption>${peli.titulo}</figcaption>
        <button class="btn-megusta" aria-label="Me gusta">❤</button>
      `;
      contenedor.appendChild(figure);
    });
  }
}

//FILTROS Y BÚSQUEDA EN peliculas.html
document.addEventListener('DOMContentLoaded', function () {
  const selectAño = document.getElementById('año');
  const selectUniverso = document.getElementById('universo');
  const selectCategoria = document.getElementById('categoria');

  function aplicarFiltros() {
    const tarjetas = document.querySelectorAll('.tarjeta-pelicula');
    const filtroAño = selectAño ? selectAño.value : 'todos';
    const filtroUniverso = selectUniverso ? selectUniverso.value : 'todos';
    const filtroCategoria = selectCategoria ? selectCategoria.value : 'todos';

    tarjetas.forEach(tarjeta => {
      const año = tarjeta.dataset.año;
      const universo = tarjeta.dataset.universo;
      const categoria = tarjeta.dataset.categoria;

      const coincide = (filtroAño === 'todos' || año === filtroAño) &&
                       (filtroUniverso === 'todos' || universo === filtroUniverso) &&
                       (filtroCategoria === 'todos' || categoria === filtroCategoria);

      tarjeta.style.display = coincide ? 'block' : 'none';
    });
  }

  if (selectAño && selectUniverso && selectCategoria) {
    selectAño.addEventListener('change', aplicarFiltros);
    selectUniverso.addEventListener('change', aplicarFiltros);
    selectCategoria.addEventListener('change', aplicarFiltros);
    aplicarFiltros();
  }
});

// Buscador en tiempo real
const buscador = document.getElementById('buscador');
if (buscador) {
  buscador.addEventListener('input', function () {
    const termino = this.value.toLowerCase();
    document.querySelectorAll('.tarjeta-pelicula').forEach(tarjeta => {
      const titulo = tarjeta.querySelector('figcaption').textContent.toLowerCase();
      tarjeta.style.display = titulo.includes(termino) ? 'block' : 'none';
    });
  });
}

//REGISTRO DE USUARIO 
document.addEventListener('DOMContentLoaded', function () {
  const formRegistro = document.querySelector('.form-registro');
  const formLogin = document.querySelector('.form-sesion');

  // --- Validación de registro ---
  if (formRegistro) {
    formRegistro.addEventListener('submit', function (e) {
      e.preventDefault(); // evitar envío real

      try {
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email_re').value.trim();
        const pass1 = document.getElementById('password_re').value;
        const pass2 = document.getElementById('confirmar').value;
        const terminos = document.getElementById('terminos').checked;

        // Validar nombre (solo letras y espacios)
        if (!/^[a-zA-Z\s]+$/.test(nombre)) {
          alert('El nombre solo puede contener letras y espacios.');
          return;
        }

        if (nombre.length < 2) {
          alert('El nombre debe tener al menos 2 letras.');
          return;
        }

        // Validar correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          alert('Por favor ingresa un correo electrónico válido.');
          return;
        }

        // Validar contraseña
        if (pass1.length < 8) {
          alert('La contraseña debe tener al menos 8 caracteres.');
          return;
        }

        if (pass1 !== pass2) {
          alert('Las contraseñas no coinciden.');
          return;
        }

        if (!terminos) {
          alert('Debes aceptar los términos y condiciones.');
          return;
        }

        // Guardar usuario
        localStorage.setItem('usuarioAutenticado', JSON.stringify({ nombre, email }));
        alert('¡Registro exitoso! Bienvenido, ' + nombre + '. Ahora puedes usar "Mi lista".');
        window.location.href = 'index.html';

      } catch (error) {
        console.error('Error en el registro:', error);
        alert('Hubo un error al registrar. Por favor, inténtalo de nuevo.');
      }
    });
  }

  // --- Validación de inicio de sesión ---
  if (formLogin) {
    formLogin.addEventListener('submit', function (e) {
      e.preventDefault();

      try {
        const email = document.getElementById('email').value.trim();
        const pass = document.getElementById('password').value;

        // Aquí simulamos autenticación (en un proyecto real, verificarías con backend)
        // Para este ejemplo, asumimos que cualquier correo registrado ya es válido
        const usuarioGuardado = JSON.parse(localStorage.getItem('usuarioAutenticado') || 'null');

        if (usuarioGuardado && usuarioGuardado.email === email) {
          // Nota: en una app real, no guardarías ni verificarías la contraseña en localStorage por seguridad
          // Pero para este demo educativo, asumimos que el correo basta
          alert('¡Bienvenido, ' + usuarioGuardado.nombre + '!');
          window.location.href = 'index.html';
        } else {
          alert('Correo o contraseña incorrectos. ¿No tienes cuenta? Regístrate.');
        }

      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Error al iniciar sesión. Inténtalo de nuevo.');
      }
    });
  }
});
// RESEÑAS EN PÁGINA DE DETALLES 
document.addEventListener('DOMContentLoaded', function () {
  const formReseña = document.getElementById('form-reseña');
  const listaReseñas = document.getElementById('lista-reseñas');

  if (!formReseña || !listaReseñas) return;

  const nombrePelicula = formReseña.getAttribute('data-pelicula');

  // Función para cargar y mostrar reseñas
  function cargarReseñas() {
    const todasReseñas = JSON.parse(localStorage.getItem('reseñas') || '{}');
    const reseñasPeli = todasReseñas[nombrePelicula] || [];

    if (reseñasPeli.length === 0) {
      listaReseñas.innerHTML = '<p style="text-align:center; color:#777;">Aún no hay reseñas.</p>';
      return;
    }

    listaReseñas.innerHTML = '';
    reseñasPeli.forEach(reseña => {
      const div = document.createElement('div');
      div.className = 'reseña-item';
      div.innerHTML = `
        <div class="nombre">${reseña.nombre}</div>
        <div class="puntuacion">⭐ ${reseña.puntuacion}/10</div>
        <div class="comentario">${reseña.comentario}</div>
      `;
      listaReseñas.appendChild(div);
    });
  }

  // Manejar envío del formulario
  formReseña.addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const puntuacion = document.getElementById('puntuacion').value;
    const comentario = document.getElementById('comentario').value.trim();

    if (!nombre || !puntuacion || !comentario) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    // Cargar reseñas existentes
    const todasReseñas = JSON.parse(localStorage.getItem('reseñas') || '{}');
    if (!todasReseñas[nombrePelicula]) {
      todasReseñas[nombrePelicula] = [];
    }

    // Añadir nueva reseña
    todasReseñas[nombrePelicula].push({ nombre, puntuacion, comentario });

    // Guardar
    localStorage.setItem('reseñas', JSON.stringify(todasReseñas));

    // Mostrar mensaje y recargar
    alert('¡Gracias por tu reseña!');
    formReseña.reset();
    cargarReseñas(); // actualiza la lista
  });

  // Cargar reseñas al inicio
  cargarReseñas();
});


// Mostrar tooltip de sinopsis al hacer hover
document.addEventListener('DOMContentLoaded', function () {
  const tooltip = document.getElementById('tooltip-sinopsis');

  document.querySelectorAll('.tarjeta-pelicula').forEach(tarjeta => {
    tarjeta.addEventListener('mouseenter', function (e) {
  const sinopsis = this.getAttribute('data-sinopsis');
  if (!sinopsis) return;

  tooltip.textContent = sinopsis;
  tooltip.classList.add('visible');

  // Obtener posición y dimensiones de la tarjeta
  const rect = this.getBoundingClientRect();
  
  // Centrar el tooltip en el medio de la tarjeta
  const left = rect.left + window.scrollX + (rect.width / 2);
  const top = rect.top + window.scrollY + (rect.height / 2);

  // Posicionar el tooltip (centrado con transform)
  tooltip.style.left = left + 'px';
  tooltip.style.top = top + 'px';
  tooltip.style.transform = 'translate(-50%, -50%)';
});

    tarjeta.addEventListener('mouseleave', function () {
      tooltip.classList.remove('visible');
    });
  });
});