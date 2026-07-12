"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

type NoteRecord = {
  id: string;
  category: string;
  title: string;
  description: string | null;
  metadata: string | null;
  created_at: string | null;
};

type ViewKey =
  | "ringkasan"
  | "pencatatan"
  | "program"
  | "dokumentasi"
  | "galeri"
  | "anggota";

const initialNoteForm = {
  category: "Kehadiran",
  title: "",
  description: "",
  metadata: "",
};

const sidebarItems: Array<{ key: ViewKey; label: string; icon: JSX.Element }> =
  [
    {
      key: "ringkasan",
      label: "Ringkasan",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      key: "pencatatan",
      label: "Pencatatan",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 2H15V6H9V2Z" />
          <path d="M4 6H20V22H4V6Z" />
          <line x1="8" y1="12" x2="16" y2="12" />
          <line x1="8" y1="16" x2="16" y2="16" />
        </svg>
      ),
    },
    {
      key: "program",
      label: "Program Kerja",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
        </svg>
      ),
    },
    {
      key: "dokumentasi",
      label: "Dokumentasi",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2Z" />
        </svg>
      ),
    },
    {
      key: "galeri",
      label: "Galeri",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      ),
    },
    {
      key: "anggota",
      label: "Profil Anggota",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
  ];

const programItems = [
  { title: "Pelatihan Digitalisasi UMKM", status: "Berjalan" },
  { title: "Bimbingan Belajar Anak Desa", status: "Rencana" },
  { title: "Pemetaan Potensi Desa", status: "Selesai" },
];

const documentationItems = [
  { date: "12 Juli 2026", title: "Pembukaan Pelatihan Digitalisasi UMKM" },
  { date: "8 Juli 2026", title: "Pemetaan Potensi Desa Selesai" },
];

const memberItems = [
  { name: "Fadli Kamil", role: "Ketua", prodi: "—" },
  { name: "Cipa", role: "Sekretaris", prodi: "—" },
  { name: "Vera", role: "Sekretaris", prodi: "—" },
  { name: "Risa", role: "Bendahara", prodi: "—" },
];

export default function AdminPage() {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeView, setActiveView] = useState<ViewKey>("ringkasan");
  const [notes, setNotes] = useState<NoteRecord[]>([]);
  const [form, setForm] = useState(initialNoteForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supabaseConfigured = isSupabaseConfigured();
  const allowedAdminEmails = (
    process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "admin@kkn.com"
  )
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      const supabase = getSupabaseClient();
      if (!supabase) {
        if (isMounted) {
          setAuthChecking(false);
        }
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      setAuthUser(session?.user ?? null);
      setAuthChecking(false);

      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, nextSession) => {
          if (!isMounted) {
            return;
          }
          setAuthUser(nextSession?.user ?? null);
        },
      );

      return () => {
        authListener.subscription.unsubscribe();
      };
    };

    void initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const loadNotes = async () => {
    const supabase = getSupabaseClient();

    if (!supabase || !authUser) {
      setNotes([]);
      setLoading(false);
      if (!authUser) {
        return;
      }
      setError(
        "Supabase belum dikonfigurasi. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY terlebih dahulu.",
      );
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("notes")
      .select("id, category, title, description, metadata, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      setNotes([]);
      setLoading(false);
      return;
    }

    setNotes(data ?? []);
    setError(null);
    setLoading(false);
  };

  useEffect(() => {
    if (authChecking) {
      return;
    }

    if (!authUser) {
      setNotes([]);
      setLoading(false);
      return;
    }

    void loadNotes();
  }, [authUser, authChecking]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const supabase = getSupabaseClient();
    if (!supabase) {
      setLoginError("Konfigurasi Supabase belum lengkap.");
      return;
    }

    setLoginLoading(true);
    setLoginError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginForm.email.trim(),
      password: loginForm.password,
    });

    if (error) {
      setLoginError(error.message);
      setLoginLoading(false);
      return;
    }

    const email = data.user?.email?.toLowerCase() ?? "";
    const isAllowed = allowedAdminEmails.includes(email);

    if (!isAllowed) {
      await supabase.auth.signOut();
      setLoginError("Akun ini tidak memiliki akses admin.");
      setLoginLoading(false);
      return;
    }

    setAuthUser(data.user);
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setAuthUser(null);
    setLoginForm({ email: "", password: "" });
    setLoginError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!supabaseConfigured) {
      setError("Konfigurasi Supabase belum lengkap.");
      return;
    }

    if (!authUser) {
      setError("Silakan login kembali sebelum mengubah data.");
      return;
    }

    const allowed = allowedAdminEmails.includes(
      authUser.email?.toLowerCase() ?? "",
    );
    if (!allowed) {
      setError("Akun Anda tidak memiliki akses admin.");
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return;
    }

    setSubmitting(true);
    setMessage(null);
    setError(null);

    const { error } = await supabase.from("notes").insert({
      category: form.category,
      title: form.title,
      description: form.description,
      metadata: form.metadata || "Ditambahkan lewat admin panel",
    });

    if (error) {
      setError(error.message);
      setSubmitting(false);
      return;
    }

    setMessage("Catatan berhasil disimpan ke Supabase.");
    setForm(initialNoteForm);
    await loadNotes();
    setSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-[#F7F4ED] text-[#2C3B2E]">
      {!authUser ? (
        <div className="flex min-h-screen items-center justify-center px-6 py-10">
          <div className="w-full max-w-sm">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-[#C08A2E] bg-white p-0.5 shadow-sm">
                <img
                  src="/logo-kkn.png"
                  alt="Logo KKN Rancamanyar"
                  className="h-full w-full rounded-full object-contain"
                  decoding="async"
                />
              </div>
              <p className="label-eyebrow mb-2">Admin Panel</p>
              <h1 className="font-display text-2xl font-semibold">
                KKN Rancamanyar
              </h1>
            </div>

            <div className="rounded-2xl border border-[#2C3B2E]/10 bg-white p-7 shadow-sm">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-medium text-[#4A5D45]">
                    Email
                  </label>
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(event) =>
                      setLoginForm((prev) => ({
                        ...prev,
                        email: event.target.value,
                      }))
                    }
                    placeholder="nama@email.com"
                    className="w-full rounded-xl border border-[#2C3B2E]/15 px-4 py-2.5 text-sm outline-none transition focus:border-[#C08A2E]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium text-[#4A5D45]">
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(event) =>
                      setLoginForm((prev) => ({
                        ...prev,
                        password: event.target.value,
                      }))
                    }
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-[#2C3B2E]/15 px-4 py-2.5 text-sm outline-none transition focus:border-[#C08A2E]"
                  />
                </div>
                {loginError ? (
                  <p className="text-sm text-amber-700">{loginError}</p>
                ) : null}
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full rounded-xl bg-[#2C3B2E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3d5138] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loginLoading ? "Memeriksa akses..." : "Masuk"}
                </button>
              </form>
              <p className="mt-5 text-center text-xs text-[#4A5D45]/60">
                Login memakai akun Supabase Auth yang sudah terdaftar sebagai
                admin.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex min-h-screen flex-col md:flex-row">
          <aside className="w-full border-b border-[#2C3B2E]/10 bg-[#EFE9DB] px-4 py-6 md:w-64 md:min-h-screen md:border-b-0 md:border-r">
            <div className="mb-8 flex items-center gap-3 px-2">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-[#C08A2E] bg-white p-0.5 shadow-sm">
                <img
                  src="/logo-kkn.png"
                  alt="Logo KKN Rancamanyar"
                  className="h-full w-full rounded-full object-contain"
                  decoding="async"
                  onError={(event) => {
                    const target = event.currentTarget as HTMLImageElement;
                    target.style.display = "none";
                    const fallback =
                      target.parentElement?.querySelector("span");
                    if (fallback) {
                      fallback.classList.remove("hidden");
                    }
                  }}
                />
                <span className="hidden font-display text-sm font-semibold text-[#2C3B2E]">
                  KKN
                </span>
              </div>
              <div>
                <p className="font-display text-sm font-semibold leading-tight">
                  Rancamanyar
                </p>
                <p className="text-xs text-[#4A5D45]">Admin Panel</p>
              </div>
            </div>

            <nav className="space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveView(item.key)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    activeView === item.key
                      ? "bg-white/90 text-[#2C3B2E] font-semibold"
                      : "text-[#4A5D45] hover:bg-white/60"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>

            <button
              onClick={handleLogout}
              className="mt-8 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#4A5D45] transition-colors hover:bg-white/60"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Keluar
            </button>
          </aside>

          <main className="flex-1 min-h-screen">
            <div className="flex items-center justify-between border-b border-[#2C3B2E]/10 bg-white px-6 py-4 md:px-10">
              <div>
                <p className="text-xs text-[#4A5D45]">Selamat datang,</p>
                <p className="font-display font-semibold">Fadli Kamil</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EFE9DB] text-xs font-semibold">
                FK
              </div>
            </div>

            <div className="px-6 py-8 md:px-10">
              {message ? (
                <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {message}
                </div>
              ) : null}

              {error ? (
                <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  {error}
                </div>
              ) : null}

              {activeView === "ringkasan" ? (
                <div>
                  <h2 className="mb-6 font-display text-2xl font-semibold">
                    Ringkasan
                  </h2>
                  <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="rounded-2xl border border-[#2C3B2E]/10 bg-white p-5">
                      <p className="mb-1 text-xs text-[#4A5D45]">
                        Total Catatan
                      </p>
                      <p className="font-display text-2xl font-semibold">
                        {notes.length}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-[#2C3B2E]/10 bg-white p-5">
                      <p className="mb-1 text-xs text-[#4A5D45]">
                        Program Kerja
                      </p>
                      <p className="font-display text-2xl font-semibold">
                        {programItems.length}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-[#2C3B2E]/10 bg-white p-5">
                      <p className="mb-1 text-xs text-[#4A5D45]">Dokumentasi</p>
                      <p className="font-display text-2xl font-semibold">
                        {documentationItems.length}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-[#2C3B2E]/10 bg-white p-5">
                      <p className="mb-1 text-xs text-[#4A5D45]">Anggota</p>
                      <p className="font-display text-2xl font-semibold">
                        {memberItems.length + 13}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#2C3B2E]/10 bg-white p-6">
                    <p className="label-eyebrow mb-4">Aktivitas Terbaru</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-[#2C3B2E]/5 py-2">
                        <div className="flex items-center gap-3">
                          <span className="status-dot inline-block h-2 w-2 rounded-full bg-[#C08A2E]" />
                          <p className="text-sm">
                            Catatan kas mingguan ditambahkan
                          </p>
                        </div>
                        <p className="text-xs text-[#4A5D45]/60">12 Jul</p>
                      </div>
                      <div className="flex items-center justify-between border-b border-[#2C3B2E]/5 py-2">
                        <div className="flex items-center gap-3">
                          <span className="status-dot inline-block h-2 w-2 rounded-full bg-[#4A5D45]" />
                          <p className="text-sm">
                            Program “Bimbingan Belajar” diubah menjadi berjalan
                          </p>
                        </div>
                        <p className="text-xs text-[#4A5D45]/60">11 Jul</p>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <span className="status-dot inline-block h-2 w-2 rounded-full bg-[#C08A2E]" />
                          <p className="text-sm">
                            3 foto ditambahkan ke galeri
                          </p>
                        </div>
                        <p className="text-xs text-[#4A5D45]/60">10 Jul</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {activeView === "pencatatan" ? (
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="font-display text-2xl font-semibold">
                      Pencatatan
                    </h2>
                  </div>

                  <div className="mb-6 rounded-2xl border border-[#2C3B2E]/10 bg-white p-6">
                    <p className="label-eyebrow mb-4">Tambah Catatan Baru</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <label className="block text-sm font-medium text-[#4A5D45]">
                          Kategori
                          <select
                            value={form.category}
                            onChange={(event) =>
                              setForm((prev) => ({
                                ...prev,
                                category: event.target.value,
                              }))
                            }
                            className="mt-2 w-full rounded-xl border border-[#2C3B2E]/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#C08A2E]"
                          >
                            <option value="Kehadiran">Kehadiran</option>
                            <option value="Keuangan">Keuangan</option>
                            <option value="Progres Proker">
                              Progres Proker
                            </option>
                            <option value="Logistik">Logistik</option>
                            <option value="Humas">Humas</option>
                            <option value="Konsumsi">Konsumsi</option>
                          </select>
                        </label>
                        <label className="block text-sm font-medium text-[#4A5D45]">
                          Metadata / penulis
                          <input
                            value={form.metadata}
                            onChange={(event) =>
                              setForm((prev) => ({
                                ...prev,
                                metadata: event.target.value,
                              }))
                            }
                            placeholder="Contoh: 20 Juli 2026 · oleh Cipa"
                            className="mt-2 w-full rounded-xl border border-[#2C3B2E]/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#C08A2E]"
                          />
                        </label>
                      </div>
                      <label className="block text-sm font-medium text-[#4A5D45]">
                        Judul
                        <input
                          required
                          value={form.title}
                          onChange={(event) =>
                            setForm((prev) => ({
                              ...prev,
                              title: event.target.value,
                            }))
                          }
                          placeholder="Contoh: Rekap Kas Minggu 2"
                          className="mt-2 w-full rounded-xl border border-[#2C3B2E]/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#C08A2E]"
                        />
                      </label>
                      <label className="block text-sm font-medium text-[#4A5D45]">
                        Catatan
                        <textarea
                          required
                          value={form.description}
                          onChange={(event) =>
                            setForm((prev) => ({
                              ...prev,
                              description: event.target.value,
                            }))
                          }
                          rows={4}
                          placeholder="Tulis rincian catatan di sini..."
                          className="mt-2 w-full resize-none rounded-xl border border-[#2C3B2E]/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#C08A2E]"
                        />
                      </label>
                      <button
                        type="submit"
                        disabled={submitting || !supabaseConfigured}
                        className="rounded-xl bg-[#C08A2E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a8791f] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {submitting ? "Menyimpan..." : "Simpan Catatan"}
                      </button>
                    </form>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-[#2C3B2E]/10 bg-white">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#2C3B2E]/10 text-left text-xs text-[#4A5D45]">
                          <th className="px-6 py-3 font-medium">Kategori</th>
                          <th className="px-6 py-3 font-medium">Judul</th>
                          <th className="px-6 py-3 font-medium">Tanggal</th>
                          <th className="px-6 py-3 font-medium">Oleh</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td
                              colSpan={4}
                              className="px-6 py-6 text-[#4A5D45]"
                            >
                              Memuat catatan...
                            </td>
                          </tr>
                        ) : notes.length === 0 ? (
                          <tr>
                            <td
                              colSpan={4}
                              className="px-6 py-6 text-[#4A5D45]"
                            >
                              Belum ada catatan.
                            </td>
                          </tr>
                        ) : (
                          notes.map((note) => (
                            <tr
                              key={note.id}
                              className="border-b border-[#2C3B2E]/5"
                            >
                              <td className="px-6 py-3">
                                <span className="rounded-full bg-[#4A5D45]/10 px-2 py-1 text-xs text-[#4A5D45]">
                                  {note.category}
                                </span>
                              </td>
                              <td className="px-6 py-3">{note.title}</td>
                              <td className="px-6 py-3 text-[#4A5D45]">
                                {note.created_at?.slice(0, 10) ?? "Baru"}
                              </td>
                              <td className="px-6 py-3 text-[#4A5D45]">
                                {note.metadata ?? "Admin"}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}

              {activeView === "program" ? (
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="font-display text-2xl font-semibold">
                      Program Kerja
                    </h2>
                    <button className="rounded-xl bg-[#2C3B2E] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#3d5138]">
                      + Tambah Program
                    </button>
                  </div>
                  <div className="overflow-hidden rounded-2xl border border-[#2C3B2E]/10 bg-white">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#2C3B2E]/10 text-left text-xs text-[#4A5D45]">
                          <th className="px-6 py-3 font-medium">Program</th>
                          <th className="px-6 py-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {programItems.map((item) => (
                          <tr
                            key={item.title}
                            className="border-b border-[#2C3B2E]/5"
                          >
                            <td className="px-6 py-3">{item.title}</td>
                            <td className="px-6 py-3">
                              <span className="rounded-full bg-[#4A5D45]/10 px-2 py-1 text-xs text-[#4A5D45]">
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}

              {activeView === "dokumentasi" ? (
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="font-display text-2xl font-semibold">
                      Dokumentasi Kegiatan
                    </h2>
                    <button className="rounded-xl bg-[#2C3B2E] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#3d5138]">
                      + Tambah Kegiatan
                    </button>
                  </div>
                  <div className="space-y-4">
                    {documentationItems.map((item) => (
                      <div
                        key={item.title}
                        className="flex items-center justify-between rounded-2xl border border-[#2C3B2E]/10 bg-white p-5"
                      >
                        <div>
                          <p className="mb-1 text-xs font-semibold text-[#C08A2E]">
                            {item.date}
                          </p>
                          <p className="font-display font-semibold">
                            {item.title}
                          </p>
                        </div>
                        <button className="text-xs font-semibold text-[#C08A2E]">
                          Edit
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {activeView === "galeri" ? (
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="font-display text-2xl font-semibold">
                      Galeri
                    </h2>
                    <button className="rounded-xl bg-[#2C3B2E] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#3d5138]">
                      + Unggah Foto
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="relative aspect-square rounded-xl border border-[#2C3B2E]/10 bg-[#EFE9DB]"
                      >
                        <button className="absolute right-2 top-2 h-6 w-6 rounded-full bg-white/90 text-xs">
                          ✕
                        </button>
                      </div>
                    ))}
                    <div className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-[#2C3B2E]/20 text-xs text-[#4A5D45]">
                      + Tambah
                    </div>
                  </div>
                </div>
              ) : null}

              {activeView === "anggota" ? (
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="font-display text-2xl font-semibold">
                      Profil Anggota
                    </h2>
                    <button className="rounded-xl bg-[#2C3B2E] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#3d5138]">
                      + Tambah Anggota
                    </button>
                  </div>
                  <div className="overflow-hidden rounded-2xl border border-[#2C3B2E]/10 bg-white">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#2C3B2E]/10 text-left text-xs text-[#4A5D45]">
                          <th className="px-6 py-3 font-medium">Nama</th>
                          <th className="px-6 py-3 font-medium">
                            Jabatan / Divisi
                          </th>
                          <th className="px-6 py-3 font-medium">Prodi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {memberItems.map((member) => (
                          <tr
                            key={member.name}
                            className="border-b border-[#2C3B2E]/5"
                          >
                            <td className="px-6 py-3 font-medium">
                              {member.name}
                            </td>
                            <td className="px-6 py-3 text-[#4A5D45]">
                              {member.role}
                            </td>
                            <td className="px-6 py-3 text-[#4A5D45]/60">
                              {member.prodi}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}
            </div>
          </main>
        </div>
      )}
    </main>
  );
}
