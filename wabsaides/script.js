const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const year = document.querySelector('#year');

if (year) {
  year.textContent = new Date().getFullYear();
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

const contactActions = document.querySelectorAll('.contact-action');
contactActions.forEach((action) => {
  const trigger = action.querySelector('.contact-trigger');
  if (!trigger) return;

  trigger.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = action.classList.toggle('open');
    trigger.setAttribute('aria-expanded', String(isOpen));
  });
});

document.addEventListener('click', () => {
  contactActions.forEach((action) => {
    action.classList.remove('open');
    const trigger = action.querySelector('.contact-trigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  });
});

const form = document.querySelector('.appointment-form');
if (form) {
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const button = form.querySelector('button');
    if (button) {
      const originalText = button.textContent;
      button.textContent = 'Request Sent';
      button.disabled = true;
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        form.reset();
      }, 2000);
    }
  });
}

const tour = document.querySelector('.hospital-tour');
if (tour) {
  const slides = [...tour.querySelectorAll('.tour-scene')];
  const dots = [...tour.querySelectorAll('.tour-dot')];
  let currentSlide = 0;

  const showSlide = (slideIndex) => {
    currentSlide = slideIndex;
    slides.forEach((slide, index) => slide.classList.toggle('active', index === currentSlide));
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
      dot.setAttribute('aria-current', index === currentSlide ? 'true' : 'false');
    });
  };

  dots.forEach((dot) => dot.addEventListener('click', () => {
    showSlide(Number(dot.dataset.tourTarget));
  }));

  window.setInterval(() => showSlide((currentSlide + 1) % slides.length), 9300);
}
