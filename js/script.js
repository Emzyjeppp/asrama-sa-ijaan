// ===== Mobile nav toggle =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.classList.toggle('is-active', isOpen);
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.classList.remove('is-active');
  });
});

// ===== Scroll reveal =====
const revealTargets = document.querySelectorAll(
  '.about-card, .gallery-item, .schedule-card, .extracurricular-card, .testimoni-card, .contact-info, .contact-form'
);
revealTargets.forEach((el) => el.classList.add('reveal'));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealTargets.forEach((el) => observer.observe(el));

// ===== Contact form -> WhatsApp =====
const WHATSAPP_NUMBER = '6285754333877'; // Faqih Badalie — kontak Asrama Sa-Ijaan

const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const nama = document.getElementById('nama').value.trim();
  const telepon = document.getElementById('telepon').value.trim();
  const asal = document.getElementById('asal').value.trim();
  const pesan = document.getElementById('pesan').value.trim();

  const lines = [
    'Halo, saya ingin mendaftar di Asrama Sa-Ijaan Yogyakarta.',
    `Nama: ${nama}`,
    `No. WhatsApp: ${telepon}`,
  ];
  if (asal) lines.push(`Asal Kampus/Prodi: ${asal}`);
  if (pesan) lines.push(`Pesan: ${pesan}`);

  const text = encodeURIComponent(lines.join('\n'));
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  window.open(url, '_blank', 'noopener');
});

// ===== Footer year =====
document.getElementById('year').textContent = new Date().getFullYear();
