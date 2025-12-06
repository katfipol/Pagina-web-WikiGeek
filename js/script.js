document.addEventListener('DOMContentLoaded', function() {
  const menuHamburguesa = document.getElementById('menu-hamburguesa');
  const sesion = document.querySelector('.sesion');
  const inicio = document.querySelector('.inicio');

  if (menuHamburguesa && sesion && inicio) {
    menuHamburguesa.addEventListener('click', function() {
      // Toggle clase 'active' en el menú hamburguesa
      this.classList.toggle('active');
      
      // Toggle visibilidad de los elementos móviles
      sesion.classList.toggle('active');
      inicio.classList.toggle('visible');
    });
  }
});

function agregarAPelicula(e) {
  // Detener comportamiento por defecto si es un <a>
  if (e.target.tagName === 'A') {
    e.preventDefault();
  }

  // Buscar el contenedor de la tarjeta más cercano
  const tarjeta = e.target.closest('.tarjeta-pelicula');
  if (!tarjeta) return;

  // Obtener el título y la imagen
  const titulo = tarjeta.querySelector('figcaption').textContent;
  const imgSrc = tarjeta.querySelector('img').src;

  // Cargar lista actual
  let miLista = JSON.parse(sessionStorage.getItem('miLista') || '[]');

  // Evitar duplicados
  const existe = miLista.some(peli => peli.titulo === titulo);
  if (existe) {
    alert('¡Ya está en tu lista!');
    return;
  }

  // Añadir nueva película
  miLista.push({ titulo, imgSrc });

  // Guardar
  sessionStorage.setItem('miLista', JSON.stringify(miLista));

  // Feedback visual
  alert('¡Añadido a tu lista!');
}

// ========== EVENTOS ==========
// Añadir a "Mi lista" desde cualquier página
document.querySelectorAll('.btn-pelicula, .btn-agregarlista').forEach(boton => {
  boton.addEventListener('click', agregarAPelicula);
});

// Mostrar lista en milista.html
if (document.body.contains(document.getElementById('pelisguardadas'))) {
  const contenedor = document.getElementById('pelisguardadas');
  const mensajeVacio = document.getElementById('mensaje-vacio');
  
  let miLista = JSON.parse(sessionStorage.getItem('miLista') || '[]');
  
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
document.addEventListener('DOMContentLoaded', function() {
  const selectAño = document.getElementById('año');
  const selectUniverso = document.getElementById('universo');
  const selectCategoria = document.getElementById('categoria');
  
  // Seleccionar todas las tarjetas de películas (de todas las secciones)
  const tarjetas = document.querySelectorAll('.tarjeta-pelicula');

  // Función para aplicar los filtros
  function aplicarFiltros() {
    const filtroAño = selectAño ? selectAño.value : 'todos';
    const filtroUniverso = selectUniverso ? selectUniverso.value : 'todos';
    const filtroCategoria = selectCategoria ? selectCategoria.value : 'todos';

    tarjetas.forEach(tarjeta => {
      const año = tarjeta.dataset.año;
      const universo = tarjeta.dataset.universo;
      const categoria = tarjeta.dataset.categoria;

      const coincideAño = (filtroAño === 'todos') || (año === filtroAño);
      const coincideUniverso = (filtroUniverso === 'todos') || (universo === filtroUniverso);
      const coincideCategoria = (filtroCategoria === 'todos') || (categoria === filtroCategoria);

      if (coincideAño && coincideUniverso && coincideCategoria) {
        tarjeta.style.display = 'block';
      } else {
        tarjeta.style.display = 'none';
      }
    });
  }

  // Solo aplicar filtros si estamos en la página de catálogo (peliculas.html)
  if (selectAño && selectUniverso && selectCategoria) {
    selectAño.addEventListener('change', aplicarFiltros);
    selectUniverso.addEventListener('change', aplicarFiltros);
    selectCategoria.addEventListener('change', aplicarFiltros);

    // Aplicar filtros iniciales
    aplicarFiltros();
  }
});
// Buscador en tiempo real
document.getElementById('buscador')?.addEventListener('input', function() {
  const termino = this.value.toLowerCase();
  document.querySelectorAll('.tarjeta-pelicula').forEach(tarjeta => {
    const titulo = tarjeta.querySelector('figcaption').textContent.toLowerCase();
    tarjeta.style.display = titulo.includes(termino) ? 'block' : 'none';
  });
});
