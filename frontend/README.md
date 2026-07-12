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

- Konten utama kini dikelola dari Supabase melalui halaman `/admin`: catatan, program kerja, dokumentasi, galeri, dan anggota.
- Font Fraunces & Inter dimuat otomatis lewat `next/font/google` (lebih cepat & tanpa perlu link manual ke Google Fonts).
- Semua warna & style custom (termasuk class Tailwind arbitrary seperti `bg-[#2C3B2E]/10`) dipertahankan apa adanya agar tampilan identik.

## Deploy dengan Supabase dan Vercel

### 1. Siapkan Supabase

1. Buat project baru di Supabase.
2. Buka SQL Editor, lalu jalankan isi file `supabase/schema.sql`.
3. Daftarkan email admin ke tabel `admin_users` lewat SQL Editor:
   ```sql
   insert into public.admin_users (email)
   values ('admin@kkn.com')
   on conflict (email) do nothing;
   ```
4. Buka Authentication -> Users, lalu buat user admin dengan email dan password yang sama.
5. Buka Project Settings -> API, lalu salin Project URL dan anon public key.

> Jangan masukkan `service_role` key ke aplikasi Next.js atau Vercel env publik. Project ini hanya membutuhkan anon public key karena akses tulis dibatasi oleh RLS dan Supabase Auth.

### 2. Konfigurasi environment

Isi environment variable berikut di lokal dan Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_ADMIN_EMAILS=admin@kkn.com
```

Jika admin lebih dari satu, pisahkan email dengan koma:

```bash
NEXT_PUBLIC_ADMIN_EMAILS=admin@kkn.com,sekretaris@kkn.com
```

### 3. Deploy ke Vercel

Saat import repository di Vercel, gunakan konfigurasi ini:

- Framework Preset: `Next.js`
- Root Directory: `frontend`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: biarkan default untuk Next.js

Tambahkan environment variable dari langkah sebelumnya di Project Settings -> Environment Variables, lalu deploy ulang.

### 4. Mengelola konten

Masuk ke `/admin` memakai akun Supabase Auth yang emailnya ada di `NEXT_PUBLIC_ADMIN_EMAILS` dan tabel `admin_users`. Dari panel admin, konten berikut bisa ditambah, diedit, dan dihapus:

- Catatan mading (`notes`)
- Program kerja (`programs`), termasuk upload gambar program
- Dokumentasi kegiatan (`activities`)
- Foto galeri (`gallery`) melalui upload gambar
- Profil anggota (`members`), termasuk upload foto profil

Schema juga membuat bucket Supabase Storage bernama `kkn-assets`. Jalankan ulang `supabase/schema.sql` jika upload gambar gagal karena bucket atau policy belum ada.

Jika tombol simpan menampilkan error izin, jalankan ulang `supabase/schema.sql`, lalu pastikan email admin sudah ada di `public.admin_users`.

### 5. Cek hasil deploy

- Halaman publik: `https://domain-vercel-anda/`
- Panel admin: `https://domain-vercel-anda/admin`
- Login memakai user yang dibuat di Supabase Auth dan emailnya tercantum di `NEXT_PUBLIC_ADMIN_EMAILS`.
