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