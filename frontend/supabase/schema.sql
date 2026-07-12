-- Tabel pencatatan
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  title text not null,
  description text not null,
  metadata text,
  created_at timestamp with time zone default now()
);

-- Tabel program kerja
create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  status text not null default 'Rencana',
  description text,
  image_url text,
  created_at timestamp with time zone default now()
);

-- Tabel dokumentasi kegiatan
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  activity_date date,
  description text,
  image_url text,
  created_at timestamp with time zone default now()
);

-- Tabel galeri
create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text,
  image_url text,
  created_at timestamp with time zone default now()
);

-- Tabel anggota
create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  division text,
  study_program text,
  image_url text,
  created_at timestamp with time zone default now()
);

alter table public.programs add column if not exists image_url text;
alter table public.activities add column if not exists image_url text;
alter table public.members add column if not exists image_url text;

-- Bucket publik untuk gambar program kerja, galeri, dan profil anggota
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'kkn-assets',
  'kkn-assets',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- Daftar email yang boleh menulis data dari admin panel
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamp with time zone default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where lower(email) = lower(auth.jwt() ->> 'email')
  );
$$;

grant execute on function public.is_admin() to authenticated;

-- Aktifkan RLS
alter table public.notes enable row level security;
alter table public.programs enable row level security;
alter table public.activities enable row level security;
alter table public.gallery enable row level security;
alter table public.members enable row level security;
alter table public.admin_users enable row level security;

-- Bersihkan policy lama agar schema aman dijalankan ulang
drop policy if exists "Allow public read access to notes" on public.notes;
drop policy if exists "Allow public read access to programs" on public.programs;
drop policy if exists "Allow public read access to activities" on public.activities;
drop policy if exists "Allow public read access to gallery" on public.gallery;
drop policy if exists "Allow public read access to members" on public.members;

drop policy if exists "Allow authenticated users to insert notes" on public.notes;
drop policy if exists "Allow authenticated users to update notes" on public.notes;
drop policy if exists "Allow authenticated users to delete notes" on public.notes;

drop policy if exists "Allow authenticated users to insert programs" on public.programs;
drop policy if exists "Allow authenticated users to update programs" on public.programs;
drop policy if exists "Allow authenticated users to delete programs" on public.programs;

drop policy if exists "Allow authenticated users to insert activities" on public.activities;
drop policy if exists "Allow authenticated users to update activities" on public.activities;
drop policy if exists "Allow authenticated users to delete activities" on public.activities;

drop policy if exists "Allow authenticated users to insert gallery" on public.gallery;
drop policy if exists "Allow authenticated users to update gallery" on public.gallery;
drop policy if exists "Allow authenticated users to delete gallery" on public.gallery;

drop policy if exists "Allow authenticated users to insert members" on public.members;
drop policy if exists "Allow authenticated users to update members" on public.members;
drop policy if exists "Allow authenticated users to delete members" on public.members;

drop policy if exists "Allow admin users to read admin list" on public.admin_users;

drop policy if exists "Allow public read access to kkn assets" on storage.objects;
drop policy if exists "Allow admin users to upload kkn assets" on storage.objects;
drop policy if exists "Allow admin users to update kkn assets" on storage.objects;
drop policy if exists "Allow admin users to delete kkn assets" on storage.objects;

-- Kebijakan baca publik
create policy "Allow public read access to notes"
  on public.notes
  for select
  using (true);

create policy "Allow public read access to programs"
  on public.programs
  for select
  using (true);

create policy "Allow public read access to activities"
  on public.activities
  for select
  using (true);

create policy "Allow public read access to gallery"
  on public.gallery
  for select
  using (true);

create policy "Allow public read access to members"
  on public.members
  for select
  using (true);

create policy "Allow admin users to read admin list"
  on public.admin_users
  for select
  using (public.is_admin());

create policy "Allow public read access to kkn assets"
  on storage.objects
  for select
  using (bucket_id = 'kkn-assets');

create policy "Allow admin users to upload kkn assets"
  on storage.objects
  for insert
  with check (bucket_id = 'kkn-assets' and public.is_admin());

create policy "Allow admin users to update kkn assets"
  on storage.objects
  for update
  using (bucket_id = 'kkn-assets' and public.is_admin())
  with check (bucket_id = 'kkn-assets' and public.is_admin());

create policy "Allow admin users to delete kkn assets"
  on storage.objects
  for delete
  using (bucket_id = 'kkn-assets' and public.is_admin());

-- Kebijakan tulis hanya untuk pengguna terautentikasi
create policy "Allow authenticated users to insert notes"
  on public.notes
  for insert
  with check (public.is_admin());

create policy "Allow authenticated users to update notes"
  on public.notes
  for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Allow authenticated users to delete notes"
  on public.notes
  for delete
  using (public.is_admin());

create policy "Allow authenticated users to insert programs"
  on public.programs
  for insert
  with check (public.is_admin());

create policy "Allow authenticated users to update programs"
  on public.programs
  for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Allow authenticated users to delete programs"
  on public.programs
  for delete
  using (public.is_admin());

create policy "Allow authenticated users to insert activities"
  on public.activities
  for insert
  with check (public.is_admin());

create policy "Allow authenticated users to update activities"
  on public.activities
  for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Allow authenticated users to delete activities"
  on public.activities
  for delete
  using (public.is_admin());

create policy "Allow authenticated users to insert gallery"
  on public.gallery
  for insert
  with check (public.is_admin());

create policy "Allow authenticated users to update gallery"
  on public.gallery
  for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Allow authenticated users to delete gallery"
  on public.gallery
  for delete
  using (public.is_admin());

create policy "Allow authenticated users to insert members"
  on public.members
  for insert
  with check (public.is_admin());

create policy "Allow authenticated users to update members"
  on public.members
  for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Allow authenticated users to delete members"
  on public.members
  for delete
  using (public.is_admin());
