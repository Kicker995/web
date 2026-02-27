document.addEventListener('DOMContentLoaded', function() {
  const nav = document.querySelector('.nav-links');
  const menuToggle = document.querySelector('.menu-toggle');
  
  if (!nav || !menuToggle) {
    console.warn('Elementos de navegación no encontrados.');
    return;
  }
  
  let isMenuOpen = false;

  // --- LÓGICA DEL MENÚ HAMBURGUESA ---
  window.toggleMenu = function() {
    isMenuOpen = !isMenuOpen;

    const overlay = document.getElementById('menu-overlay');
    if (overlay) overlay.classList.toggle('active');

    nav.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isMenuOpen);
    
    // Animación de las barras
    const bars = menuToggle.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
      if (isMenuOpen) {
        if (index === 1) bar.style.opacity = '0';
        else {
          bar.style.transform = index === 0 
            ? 'rotate(45deg) translate(5px, 5px)' 
            : 'rotate(-45deg) translate(7px, -6px)';
        }
      } else {
        bar.style.opacity = '1';
        bar.style.transform = 'none';
      }
    });
  };
  
  // Cerrar menú al hacer clic en un link y Smooth Scroll
  nav.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      
      if (targetId === "#") {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      
      if (isMenuOpen) window.toggleMenu();
    });
  });

  // Cerrar menú al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (isMenuOpen && !nav.contains(e.target) && !menuToggle.contains(e.target)) {
      window.toggleMenu();
    }
  });


  // --- LÓGICA DEL LIGHTBOX (INSTALACIONES) ---
  const images = document.querySelectorAll("#instalaciones img");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.querySelector(".lightbox .close");
  const prevBtn = document.querySelector(".lightbox .prev");
  const nextBtn = document.querySelector(".lightbox .next");

  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    // Solo añadimos la clase, el CSS se encarga de bloquear el scroll
    document.body.classList.add("no-scroll");
    lightboxImg.src = images[currentIndex].src;
    lightbox.classList.add("active");
  }

  function closeLightbox() {
    lightbox.classList.remove("active");

    document.body.classList.remove("no-scroll");
    
    // Esperamos un poco a que termine la transición para limpiar la imagen
    setTimeout(() => { lightboxImg.src = ""; }, 400);
    
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImg.src = images[currentIndex].src;
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightboxImg.src = images[currentIndex].src;
  }

  // Event Listeners para las imágenes
  images.forEach((img, index) => {
    img.addEventListener("click", () => openLightbox(index));
  });

  closeBtn.addEventListener("click", closeLightbox);
  nextBtn.addEventListener("click", showNext);
  prevBtn.addEventListener("click", showPrev);

  // Cerrar al hacer clic en el fondo oscuro
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Soporte para teclas (Esc, Flechas) - Mejora la UX
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
  });
});