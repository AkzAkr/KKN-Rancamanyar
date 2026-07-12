# KKN Rancamanyar — Next.js

Website ini adalah hasil konversi dari `index.html` (static HTML + Tailwind CDN) menjadi project **Next.js 14 (App Router) + TypeScript + Tailwind CSS**. Tampilan dibuat sama persis dengan versi HTML aslinya, hanya strukturnya sudah dipecah menjadi komponen React yang modern dan mudah dikembangkan.

## Cara Menjalankan

1. Pastikan Node.js versi 18+ sudah terpasang.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Jalankan development server:
   ```bash
   npm run dev
   ```
4. Buka [http://localhost:3000](http://localhost:3000) di browser.

## Struktur Project

```
app/
  layout.tsx      -> root layout, load font Fraunces & Inter
  page.tsx         -> menyusun semua section
  globals.css      -> tailwind + custom CSS (warna, label-eyebrow, dll)
components/
  Navbar.tsx       -> navbar + menu mobile (client component)
  Hero.tsx         -> section hero
  Profil.tsx       -> profil kelompok, divisi, & daftar anggota
  ProgramKerja.tsx -> daftar program kerja
  Mading.tsx       -> papan pencatatan (carousel, client component)
  Dokumentasi.tsx  -> timeline dokumentasi kegiatan
  Galeri.tsx       -> grid galeri foto
  Kontak.tsx       -> info kontak & lokasi
  Footer.tsx       -> footer
```

## Catatan

- Semua data (nama anggota, program kerja, catatan mading, dsb) saat ini masih hardcoded di masing-masing komponen, persis seperti versi HTML aslinya — silakan ubah langsung di file komponen terkait, atau nanti dipindah ke CMS/API bila dibutuhkan.
- Font Fraunces & Inter dimuat otomatis lewat `next/font/google` (lebih cepat & tanpa perlu link manual ke Google Fonts).
- Semua warna & style custom (termasuk class Tailwind arbitrary seperti `bg-[#2C3B2E]/10`) dipertahankan apa adanya agar tampilan identik.
