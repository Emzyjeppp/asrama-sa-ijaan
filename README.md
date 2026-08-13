# Asrama Sa-Ijaan Yogyakarta

Website profil untuk Asrama Mahasiswa Kabupaten Kotabaru "Sa-Ijaan" Yogyakarta — asrama daerah yang disediakan Pemerintah Kabupaten Kotabaru, Kalimantan Selatan, bagi mahasiswa asal Kotabaru yang menempuh pendidikan tinggi di Yogyakarta.

Dibangun sebagai landing page satu halaman: perkenalan singkat tentang asrama, fasilitas, kegiatan, testimoni penghuni, sampai info pendaftaran.

## Isi situs

- **Hero** — perkenalan singkat dengan foto gedung asrama
- **Tentang Kami** — visi, misi, dan makna nama "Sa-Ijaan"
- **Fasilitas** — kamar tidur, ruang belajar, aula, dapur bersama, parkir, mushola
- **Program & Kegiatan** — kegiatan rutin dan agenda tahunan
- **Testimoni** — ulasan asli dari Google Maps
- **Kontak & Pendaftaran** — syarat, alur pendaftaran, biaya, dan form kontak yang terhubung langsung ke WhatsApp

## Teknologi

HTML, CSS, dan JavaScript vanilla — tanpa framework, tanpa proses build. Tinggal buka `index.html` di browser, atau host di layanan statis apa saja (GitHub Pages, Netlify, Vercel, dll).

## Struktur folder

```
├── index.html
├── css/style.css
├── js/script.js
├── assets/          foto dan logo
├── robots.txt
├── sitemap.xml
└── llms.txt
```

## Menjalankan secara lokal

Clone repo ini lalu buka `index.html` langsung di browser. Kalau perlu server statis sederhana:

```bash
npx serve .
```

## Catatan

Sebagian foto fasilitas masih berupa placeholder warna dan perlu diganti dengan foto asli di folder `assets/`. Alamat, nomor kontak, dan info biaya di situs ini sudah mengikuti data asli asrama.

---

Dikelola oleh Pemerintah Kabupaten Kotabaru, Kalimantan Selatan.
