// Función global que se llama al cargar el script de Google Translate
window.initTraduccion = function () {
  new google.translate.TranslateElement({
    pageLanguage: 'es',
    includedLanguages: 'en,es',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');

  const translateElement = document.getElementById('google_translate_element');
  if (translateElement) {
    translateElement.style.width = '150px';
    translateElement.style.height = '75px';
  }
};

// Función principal para inicializar comportamiento del encabezado
function inicializarEncabezado() {
  // Insertar script de Google Translate
  const scriptGT = document.createElement('script');
  scriptGT.src = 'https://translate.google.com/translate_a/element.js?cb=initTraduccion';
  document.body.appendChild(scriptGT);

  // Menú lateral
  const menuToggle = document.querySelector('.menu-toggle');
  const menuContainer = document.querySelector('.menu-container');
  const overlay = document.querySelector('.overlay');

  if (menuToggle && menuContainer && overlay) {
    menuToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (menuContainer.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    overlay.addEventListener('click', closeMenu);

    menuContainer.addEventListener('click', function (e) {
      e.stopPropagation();
    });

    function openMenu() {
      menuContainer.classList.add('active');
      overlay.classList.add('active');
    }

    function closeMenu() {
      menuContainer.classList.remove('active');
      overlay.classList.remove('active');
      document.querySelectorAll('.submenu.active').forEach(submenu => {
        submenu.classList.remove('active');
      });
    }

    document.querySelectorAll('.menu-btn').forEach(button => {
      button.addEventListener('click', function (e) {
        e.stopPropagation();
        document.querySelectorAll('.submenu.active').forEach(submenu => {
          if (submenu !== this.nextElementSibling) {
            submenu.classList.remove('active');
          }
        });
        this.nextElementSibling.classList.toggle('active');
      });
    });
  }

  // Botón de filtros
  const toggleFiltersButton = document.getElementById('toggleFiltersButton');
  const filtersContainer = document.getElementById('filtersContainer');

  if (toggleFiltersButton && filtersContainer) {
    toggleFiltersButton.addEventListener('click', function () {
      filtersContainer.style.display =
        filtersContainer.style.display === 'none' || !filtersContainer.style.display
          ? 'block'
          : 'none';
    });
  }

  // Cargar ionicons
  const ioniconsESM = document.createElement('script');
  ioniconsESM.type = 'module';
  ioniconsESM.src = 'https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js';
  document.body.appendChild(ioniconsESM);

  const ioniconsNoModule = document.createElement('script');
  ioniconsNoModule.noModule = true;
  ioniconsNoModule.src = 'https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js';
  document.body.appendChild(ioniconsNoModule);
}
