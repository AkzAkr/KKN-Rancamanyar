# Konteks Proyek: Website KKN Rancamanyar

## Latar Belakang

Saya (Ann) mahasiswa Teknik Informatika, akan mengikuti KKN dan mengajukan diri membantu kelompok dari segi digitalisasi. Saya menawarkan 3 opsi ke kelompok: (1) website portofolio kelompok, (2) sistem absensi QR, (3) pencatatan kegiatan otomatis. Kelompok belum merespons final, tapi saya jalan duluan mengerjakan opsi **website portofolio kelompok** sebagai prioritas pertama. Sistem absensi QR sempat dibahas konsepnya (belum dieksekusi) — ditunda.

Kelompok: **KKN Rancamanyar**, tagline "Belajar, Berkarya, Mengabdi", ditempatkan di Desa Rancamanyar, 2026.

## Identitas Visual

Logo kelompok: bertema gunung, rumah, matahari, dan tanaman, dengan garis lengkung (arc) di sekitar teks "KKN" dan "RANCAMANYAR". Palet warna dari logo:

- Hijau tua (ink): `#2C3B2E`
- Hijau medium (secondary text): `#4A5D45`
- Cream (background): `#F7F4ED`
- Cream deep (surface sekunder): `#EFE9DB`
- Gold/mustard (accent): `#C08A2E`

Font: **Fraunces** (serif, untuk heading/display) + **Inter** (sans-serif, untuk body/UI).

Signature elemen desain: garis lengkung (arc) meniru bentuk di logo, dipakai sebagai dekorasi hero section.

## Struktur Organisasi Kelompok (17 orang)

- **Ketua**: Fadli Kamil
- **Sekretaris**: Cipa, Vera
- **Bendahara**: Risa
- **Divisi Acara**: Salman, Putri, Abdul Jafar
- **Divisi PDD**: Rido, Ihsan, M. Hilmi
- **Divisi Logistik**: Rifki, Gagan, Anang
- **Divisi Konsumsi**: Siti Anisa, Khodijah
- **Divisi Humas**: Gio, Nazala

Data prodi masing-masing anggota **belum tersedia** — masih placeholder "Prodi" di semua tempat. Foto anggota juga belum ada — masih kotak placeholder krem.

## Keputusan Desain & Arsitektur yang Sudah Disepakati

1. **Dua website terpisah** direncanakan:
   - `index.html` — website publik, bisa diakses siapa saja tanpa login (untuk dosen pembimbing & warga desa)
   - `admin.html` — panel admin, perlu login, khusus dipegang oleh **Ketua (Fadli Kamil) + Sekretaris**, untuk input/edit konten

2. **Saat ini backend BELUM disetup.** Kedua file masih statis (HTML + Tailwind CSS yang di-compile jadi file, tanpa JavaScript backend/database). Admin panel baru sebatas **mockup tampilan** — tombol "Simpan"/"Tambah"/"Edit" belum benar-benar menyimpan data.

3. **Rencana ke depan (belum dieksekusi):** menggunakan **Supabase** sebagai backend (database + auth), supaya data yang diinput di admin panel bisa otomatis muncul di website publik. Ini sengaja **ditunda** atas keputusan user — konsepnya sudah disepakati, tapi belum waktunya eksekusi. Kalau lanjut ke Supabase nanti, perlu setup: skema database untuk tiap jenis konten (pencatatan, program kerja, dokumentasi, galeri, profil anggota), auth untuk 2 admin, dan koneksi API dari admin.html ke index.html.

4. **Alasan login hanya untuk admin, bukan pengunjung publik**: sudah diklarifikasi ke user bahwa pengunjung website (dosen, warga) TIDAK perlu akun — mereka bebas akses semua halaman publik. Login hanya untuk masuk ke `/admin`.

## Isu Teknis yang Sudah Diperbaiki

- **Masalah awal**: file HTML pakai `<script src="https://cdn.tailwindcss.com">` (Tailwind via CDN). Ini gagal total saat dibuka di aplikasi **Acode** (Android code editor) karena tidak bisa load CDN — hasilnya tampilan HTML polos tanpa styling sama sekali.
- **Solusi**: Tailwind CSS di-compile jadi file statis pakai Tailwind CLI (`npx tailwindcss -i input.css -o output.css --minify`), lalu CSS hasil compile di-inline langsung ke dalam tag `<style>` di HTML. Jadi file HTML sekarang **self-contained**, tidak butuh internet untuk styling. (Font Google Fonts—Fraunces & Inter—masih via internet; kalau offline total, fallback ke font default OS, tapi warna/layout/tombol tetap normal.)
- **Workflow untuk update CSS**: setiap kali menambah class Tailwind baru di HTML, harus rebuild (`npx tailwindcss -i input.css -o output.css --minify`) lalu inline ulang ke file HTML final. Ada config terpisah untuk index.html (`tailwind.config.js`) dan admin.html (`tailwind.admin.config.js`) karena `content` path-nya beda file.

## Struktur Halaman `index.html` (Website Publik)

Urutan section dari atas ke bawah:

1. **Navbar** — fixed top, logo bulat "KKN" + nama "Rancamanyar", menu: Profil, Program Kerja, Dokumentasi, Galeri, Kontak. Ada mobile hamburger menu (berfungsi, toggle show/hide via JS).

2. **Hero** — headline "Belajar, Berkarya, Mengabdi Bersama", dekorasi arc lengkung ganda di background, 2 tombol CTA (Lihat Program Kerja / Dokumentasi Kegiatan), dan 3 statistik ringkas: 17 Anggota Tim, 8 Program Kerja, 45 Hari Pengabdian.

3. **Profil** (`#profil`) — berisi:
   - 3 kartu: Ketua, Sekretaris, Bendahara (dengan nama asli)
   - Grid 5 kartu divisi (Acara, PDD, Logistik, Konsumsi, Humas) + 1 kartu "Total Anggota: 17"
   - Section "Seluruh Anggota" — **carousel horizontal scroll** (bukan grid vertikal), 17 kartu anggota (foto placeholder + nama + prodi placeholder), pakai `snap-x snap-mandatory`, scrollbar disembunyikan, ada gradient fade di ujung kanan sebagai indikator "masih ada lanjutan".

4. **Program Kerja** (`#program`) — 3 contoh proker dengan badge status (Berjalan/Rencana/Selesai): Pelatihan Digitalisasi UMKM, Bimbingan Belajar Anak Desa, Pemetaan Potensi Desa.

5. **Pencatatan** (`#pencatatan`) — section bergaya **mading/papan buletin**: kartu-kartu putih miring (rotate berbeda-beda) dengan aksen "washi tape" di atas (gold/hijau bergantian), background bertekstur titik-titik seperti cork board. **Dipaginasi jadi 2 halaman** (slider horizontal dengan `translateX`, transisi 500ms), masing-masing halaman berisi 6 kartu catatan (kategori: Kehadiran, Keuangan, Progres Proker, Logistik, Humas, Konsumsi). Ada tombol prev/next (disable otomatis di halaman pertama/terakhir) + dot indicator yang bisa diklik langsung.

6. **Dokumentasi Kegiatan** (`#dokumentasi`) — timeline bergaya story dengan garis vertikal + titik gold. **Juga dipaginasi** jadi slider (pola sama seperti Pencatatan), tapi **2 entri per halaman** (bukan 6) karena kontennya lebih berat (cerita naratif + grid foto). Total 4 entri contoh di 2 halaman.

7. **Galeri** (`#galeri`) — grid foto placeholder, **dipaginasi jadi album slide** (pola sama), 8 foto per halaman, 2 halaman contoh.

8. **Kontak & Lokasi** (`#kontak`) — info kontak (Instagram, email placeholder) + placeholder peta.

9. **Footer** — copyright + link kecil "Masuk Admin" (sengaja tidak menonjol, cuma untuk 2 admin yang tahu).

### Pola Slider yang Konsisten

Ketiga section (Pencatatan, Dokumentasi, Galeri) pakai pola JS yang sama: `overflow-hidden` wrapper → `flex` track dengan `translateX(-${page*100}%)` → tombol prev/next dengan `disabled` state otomatis → dot indicator yang toggle warna aktif/nonaktif. Variabel JS diberi nama berbeda per section (`madingTrack`/`galeriTrack`/`dokuTrack`, dst) supaya tidak konflik.

**Catatan untuk pengembangan lanjut**: pagination dan dot indicator saat ini **hardcoded manual** di HTML (jumlah halaman & dots ditulis manual, bukan digenerate otomatis dari jumlah data). Kalau nanti data sudah dari database (Supabase), sebaiknya dots & pagination digenerate dinamis via JS berdasarkan jumlah entri, bukan ditulis manual seperti sekarang.

## Struktur Halaman `admin.html` (Panel Admin — Mockup)

File terpisah dari index.html, dengan tema visual yang sama.

1. **Login Screen** (`#loginScreen`) — form email + password, tombol "Masuk". **Belum ada validasi asli** — klik tombol langsung pindah ke dashboard (murni mockup alur).

2. **Dashboard Screen** (`#dashboardScreen`, awalnya `hidden`) — layout sidebar + main content:
   - **Sidebar** kiri (hidden di mobile, `md:block`): logo, 6 menu navigasi (Ringkasan, Pencatatan, Program Kerja, Dokumentasi, Galeri, Profil Anggota), tombol Keluar di bawah.
   - **Topbar**: sapaan "Selamat datang, Fadli Kamil" + avatar inisial.
   - **6 panel view** (`.panel-view`, toggle show/hide via class `active`, dikontrol lewat `data-target` di tombol sidebar):
     - **Ringkasan**: 4 kartu statistik (Total Catatan: 6, Program Kerja: 8, Dokumentasi: 2, Anggota: 17) + list "Aktivitas Terbaru"
     - **Pencatatan**: form tambah catatan (dropdown kategori, tanggal, judul, textarea) + tabel daftar catatan
     - **Program Kerja**: tabel dengan status badge + tombol edit
     - **Dokumentasi**: list kegiatan dengan tombol edit
     - **Galeri**: grid foto dengan tombol hapus (×) + tombol "+ Tambah"
     - **Profil Anggota**: tabel anggota (nama, jabatan/divisi, prodi) menampilkan 4 baris teratas + ringkasan "+13 anggota lainnya"

Semua tombol "Simpan"/"Tambah"/"Edit"/"Hapus" di admin.html **belum fungsional** — murni tampilan, belum tersambung ke penyimpanan data apapun.

## File yang Sudah Dihasilkan

- `/mnt/user-data/outputs/index.html` — website publik lengkap, self-contained (CSS inline, tanpa CDN)
- `/mnt/user-data/outputs/admin.html` — mockup panel admin, self-contained (CSS inline, tanpa CDN)
- File kerja Tailwind (di direktori kerja, tidak perlu dibawa ke AI lain): `input.css`, `output.css`, `output-admin.css`, `tailwind.config.js`, `tailwind.admin.config.js`

## Yang Belum Dikerjakan / Perlu Dilanjutkan

1. **Backend Supabase** — belum disetup sama sekali. Ini pekerjaan besar berikutnya: skema database, auth 2-admin, sinkronisasi data admin panel ↔ website publik.
2. **Sistem absensi QR** — sempat dibahas konsepnya (pola QR statis di lokasi + form pilih nama, vs QR unik per orang di-scan koordinator), tapi ditunda dan belum ada keputusan final soal metode autentikasi dan penyimpanan data (Google Sheets vs lainnya).
3. **Data asli belum diisi**: foto anggota, prodi masing-masing anggota, nama dosen pembimbing lapangan (DPL), foto galeri asli, konten program kerja/dokumentasi yang sebenarnya (saat ini semua masih contoh realistis, bukan data asli).
4. **Peta lokasi** di section Kontak masih placeholder kotak, belum pakai embed peta asli (Google Maps dsb).
5. **Preferensi user yang penting untuk diingat**: user lebih suka **matang-kan konsep/desain dulu sebelum eksekusi teknis** (pola kerja berulang di proyek-proyek sebelumnya) — jangan buru-buru ke implementasi backend/database sebelum semua kebutuhan tampilan & konten disepakati.
