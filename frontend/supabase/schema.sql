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
  created_at timestamp with time zone default now()
);

-- Tabel dokumentasi kegiatan
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  activity_date date,
  description text,
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
  created_at timestamp with time zone default now()
);

-- Aktifkan RLS
alter table public.notes enable row level security;
alter table public.programs enable row level security;
alter table public.activities enable row level security;
alter table public.gallery enable row level security;
alter table public.members enable row level security;

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

-- Kebijakan tulis hanya untuk pengguna terautentikasi
create policy "Allow authenticated users to insert notes"
  on public.notes
  for insert
  with check (auth.role() = 'authenticated');

create policy "Allow authenticated users to update notes"
  on public.notes
  for update
  using (auth.role() = 'authenticated');

create policy "Allow authenticated users to delete notes"
  on public.notes
  for delete
  using (auth.role() = 'authenticated');

create policy "Allow authenticated users to insert programs"
  on public.programs
  for insert
  with check (auth.role() = 'authenticated');

create policy "Allow authenticated users to update programs"
  on public.programs
  for update
  using (auth.role() = 'authenticated');

create policy "Allow authenticated users to delete programs"
  on public.programs
  for delete
  using (auth.role() = 'authenticated');

create policy "Allow authenticated users to insert activities"
  on public.activities
  for insert
  with check (auth.role() = 'authenticated');

create policy "Allow authenticated users to update activities"
  on public.activities
  for update
  using (auth.role() = 'authenticated');

create policy "Allow authenticated users to delete activities"
  on public.activities
  for delete
  using (auth.role() = 'authenticated');

create policy "Allow authenticated users to insert gallery"
  on public.gallery
  for insert
  with check (auth.role() = 'authenticated');

create policy "Allow authenticated users to update gallery"
  on public.gallery
  for update
  using (auth.role() = 'authenticated');

create policy "Allow authenticated users to delete gallery"
  on public.gallery
  for delete
  using (auth.role() = 'authenticated');

create policy "Allow authenticated users to insert members"
  on public.members
  for insert
  with check (auth.role() = 'authenticated');

create policy "Allow authenticated users to update members"
  on public.members
  for update
  using (auth.role() = 'authenticated');

create policy "Allow authenticated users to delete members"
  on public.members
  for delete
  using (auth.role() = 'authenticated');
