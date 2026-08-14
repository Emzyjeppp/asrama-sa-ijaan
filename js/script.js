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
  '.about-card, .org-node, .gallery-item, .ig-tile, .schedule-card, .extracurricular-card, .testimoni-card, .rules-item, .contact-info, .contact-form'
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
const WHATSAPP_NUMBER = '6285754333877'; // Faqih Badali — kontak Asrama Sa-Ijaan

const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
const formNoteDefault = formNote.innerHTML;

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }

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
  const opened = window.open(url, '_blank', 'noopener');

  if (!opened || opened.closed) {
    formNote.innerHTML = `Popup diblokir browser. <a href="${url}" target="_blank" rel="noopener">Klik di sini untuk membuka WhatsApp</a>, atau hubungi langsung di <a href="tel:+6285754333877">0857-5433-3877</a>.`;
  } else {
    formNote.innerHTML = formNoteDefault;
  }
});

// ===== Footer year =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Back to top =====
const backToTop = document.getElementById('backToTop');

function toggleBackToTop() {
  const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200;
  backToTop.classList.toggle('is-visible', nearBottom);
}

window.addEventListener('scroll', toggleBackToTop);
toggleBackToTop();

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
