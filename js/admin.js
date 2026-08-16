// Seeded from the current index.html content as of the Cloudflare migration.
// This is only the *first* form state — once a save happens, KV takes over
// and this constant is never referenced again.
const SEED_DATA = {
  pengurus: [
    { nama: 'Zainal Abrar', jabatan: 'Ketua', tier: 'ketua' },
    { nama: 'Riko Wirawan', jabatan: 'Sekretaris', tier: 'inti' },
    { nama: 'Ahmad Rivaldi', jabatan: 'Bendahara', tier: 'inti' },
    { nama: 'Mohammad Faqih Badali', jabatan: 'Humas', tier: 'seksi' },
    { nama: 'Noor Awaliansyah', jabatan: 'Keamanan', tier: 'seksi' },
    { nama: 'Muhammad Najwan Raditama', jabatan: 'Kebersihan', tier: 'seksi' },
    { nama: 'Riqqy Fajar Maulana', jabatan: 'Perlengkapan', tier: 'seksi' },
    { nama: 'Syaikhu Basyar Suyoko', jabatan: 'Keagamaan', tier: 'seksi' },
    { nama: 'Ubaidillah', jabatan: 'Kesra', tier: 'seksi' },
  ],
  kontak: {
    whatsapp_nomor: '6285754333877',
    whatsapp_tampil: '0857-5433-3877',
    kontak_nama: 'Faqih Badali',
  },
};

const TIER_LABELS = { ketua: 'Ketua', inti: 'Inti Pengurus', seksi: 'Koordinator Seksi' };

const loginView = document.getElementById('loginView');
const editorView = document.getElementById('editorView');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const pengurusRows = document.getElementById('pengurusRows');
const pengurusError = document.getElementById('pengurusError');
const addRowBtn = document.getElementById('addRowBtn');
const saveBtn = document.getElementById('saveBtn');
const logoutBtn = document.getElementById('logoutBtn');
const saveStatus = document.getElementById('saveStatus');
const waNomorInput = document.getElementById('waNomor');
const waTampilInput = document.getElementById('waTampil');
const kontakNamaInput = document.getElementById('kontakNama');

function showLogin() {
  loginView.hidden = false;
  editorView.hidden = true;
}

function showEditor() {
  loginView.hidden = true;
  editorView.hidden = false;
}

function addPengurusRow(person) {
  const tr = document.createElement('tr');

  const namaTd = document.createElement('td');
  const namaInput = document.createElement('input');
  namaInput.type = 'text';
  namaInput.className = 'row-nama';
  namaInput.value = person?.nama || '';
  namaInput.required = true;
  namaTd.appendChild(namaInput);

  const jabatanTd = document.createElement('td');
  const jabatanInput = document.createElement('input');
  jabatanInput.type = 'text';
  jabatanInput.className = 'row-jabatan';
  jabatanInput.value = person?.jabatan || '';
  jabatanInput.required = true;
  jabatanTd.appendChild(jabatanInput);

  const tierTd = document.createElement('td');
  const tierSelect = document.createElement('select');
  tierSelect.className = 'row-tier';
  Object.entries(TIER_LABELS).forEach(([value, label]) => {
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = label;
    tierSelect.appendChild(opt);
  });
  tierSelect.value = person?.tier || 'inti';
  tierSelect.addEventListener('change', () => {
    if (tierSelect.value === 'ketua') demoteOtherKetua(tr);
  });
  tierTd.appendChild(tierSelect);

  const removeTd = document.createElement('td');
  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'admin-row-remove';
  removeBtn.textContent = '✕';
  removeBtn.setAttribute('aria-label', 'Hapus baris');
  removeBtn.addEventListener('click', () => tr.remove());
  removeTd.appendChild(removeBtn);

  tr.appendChild(namaTd);
  tr.appendChild(jabatanTd);
  tr.appendChild(tierTd);
  tr.appendChild(removeTd);
  pengurusRows.appendChild(tr);
}

function demoteOtherKetua(currentRow) {
  pengurusRows.querySelectorAll('tr').forEach((row) => {
    if (row === currentRow) return;
    const select = row.querySelector('.row-tier');
    if (select.value === 'ketua') select.value = 'inti';
  });
}

function renderPengurus(list) {
  pengurusRows.innerHTML = '';
  list.forEach((p) => addPengurusRow(p));
}

function renderKontak(kontak) {
  waNomorInput.value = kontak.whatsapp_nomor || '';
  waTampilInput.value = kontak.whatsapp_tampil || '';
  kontakNamaInput.value = kontak.kontak_nama || '';
}

function collectPengurus() {
  const rows = [...pengurusRows.querySelectorAll('tr')];
  return rows.map((row) => ({
    nama: row.querySelector('.row-nama').value.trim(),
    jabatan: row.querySelector('.row-jabatan').value.trim(),
    tier: row.querySelector('.row-tier').value,
  }));
}

async function loadContent() {
  try {
    const res = await fetch('/api/content');
    if (res.status === 404) {
      renderPengurus(SEED_DATA.pengurus);
      renderKontak(SEED_DATA.kontak);
      return;
    }
    const body = await res.json();
    if (body.ok && body.data) {
      renderPengurus(body.data.pengurus);
      renderKontak(body.data.kontak);
    } else {
      renderPengurus(SEED_DATA.pengurus);
      renderKontak(SEED_DATA.kontak);
    }
  } catch {
    renderPengurus(SEED_DATA.pengurus);
    renderKontak(SEED_DATA.kontak);
  }
}

async function checkSession() {
  try {
    const res = await fetch('/api/me');
    if (res.ok) {
      showEditor();
      await loadContent();
    } else {
      showLogin();
    }
  } catch {
    showLogin();
  }
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.hidden = true;

  const password = document.getElementById('password').value;
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ password }),
    });
    const body = await res.json();
    if (body.ok) {
      showEditor();
      await loadContent();
    } else if (body.reason === 'rate_limited') {
      loginError.textContent = 'Terlalu banyak percobaan. Coba lagi beberapa menit lagi.';
      loginError.hidden = false;
    } else {
      loginError.textContent = 'Password salah.';
      loginError.hidden = false;
    }
  } catch {
    loginError.textContent = 'Gagal menghubungi server. Coba lagi.';
    loginError.hidden = false;
  }
});

addRowBtn.addEventListener('click', () => addPengurusRow({ tier: 'inti' }));

logoutBtn.addEventListener('click', async () => {
  try {
    await fetch('/api/logout', { method: 'POST', credentials: 'same-origin' });
  } catch {
    /* ignore */
  }
  showLogin();
});

saveBtn.addEventListener('click', async () => {
  pengurusError.hidden = true;
  saveStatus.hidden = true;

  const pengurus = collectPengurus();
  const ketuaCount = pengurus.filter((p) => p.tier === 'ketua').length;

  if (pengurus.length === 0 || pengurus.some((p) => !p.nama || !p.jabatan)) {
    pengurusError.textContent = 'Nama dan jabatan tidak boleh kosong.';
    pengurusError.hidden = false;
    return;
  }
  if (ketuaCount !== 1) {
    pengurusError.textContent = 'Harus ada tepat 1 pengurus dengan tier Ketua.';
    pengurusError.hidden = false;
    return;
  }

  const payload = {
    pengurus,
    kontak: {
      whatsapp_nomor: waNomorInput.value.trim(),
      whatsapp_tampil: waTampilInput.value.trim(),
      kontak_nama: kontakNamaInput.value.trim(),
    },
  };

  saveBtn.disabled = true;
  saveBtn.textContent = 'Menyimpan...';

  try {
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(payload),
    });
    const body = await res.json();

    if (res.status === 401) {
      showLogin();
      return;
    }

    if (!body.ok) {
      saveStatus.textContent = (body.errors && body.errors.join(' ')) || 'Gagal menyimpan, periksa isian.';
      saveStatus.className = 'admin-status is-error';
      saveStatus.hidden = false;
      return;
    }

    saveStatus.textContent = `Tersimpan. Terakhir diperbarui ${new Date(body.data.updated_at).toLocaleString('id-ID')}.`;
    saveStatus.className = 'admin-status';
    saveStatus.hidden = false;
  } catch {
    saveStatus.textContent = 'Gagal menghubungi server. Coba lagi.';
    saveStatus.className = 'admin-status is-error';
    saveStatus.hidden = false;
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = 'Simpan Perubahan';
  }
});

checkSession();
