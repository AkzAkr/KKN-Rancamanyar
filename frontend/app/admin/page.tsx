"use client";

import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import type {
  ActivityRecord,
  GalleryRecord,
  MemberRecord,
  NoteRecord,
  ProgramRecord,
} from "@/lib/content-types";
import { formatDate } from "@/lib/content-utils";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

type ViewKey = "overview" | "notes" | "programs" | "activities" | "gallery" | "members";

type RecordsState = {
  notes: NoteRecord[];
  programs: ProgramRecord[];
  activities: ActivityRecord[];
  gallery: GalleryRecord[];
  members: MemberRecord[];
};

type FormState = {
  notes: {
    category: string;
    title: string;
    description: string;
    metadata: string;
  };
  programs: {
    title: string;
    status: string;
    description: string;
  };
  activities: {
    title: string;
    activity_date: string;
    description: string;
  };
  gallery: {
    title: string;
    image_url: string;
  };
  members: {
    name: string;
    role: string;
    division: string;
    study_program: string;
  };
};

type EditingState = {
  table: Exclude<ViewKey, "overview">;
  id: string;
} | null;

const emptyRecords: RecordsState = {
  notes: [],
  programs: [],
  activities: [],
  gallery: [],
  members: [],
};

const initialForms: FormState = {
  notes: {
    category: "Kehadiran",
    title: "",
    description: "",
    metadata: "",
  },
  programs: {
    title: "",
    status: "Rencana",
    description: "",
  },
  activities: {
    title: "",
    activity_date: "",
    description: "",
  },
  gallery: {
    title: "",
    image_url: "",
  },
  members: {
    name: "",
    role: "",
    division: "",
    study_program: "",
  },
};

const views: Array<{ key: ViewKey; label: string }> = [
  { key: "overview", label: "Ringkasan" },
  { key: "notes", label: "Pencatatan" },
  { key: "programs", label: "Program Kerja" },
  { key: "activities", label: "Dokumentasi" },
  { key: "gallery", label: "Galeri" },
  { key: "members", label: "Anggota" },
];

const tableLabels: Record<Exclude<ViewKey, "overview">, string> = {
  notes: "Catatan",
  programs: "Program Kerja",
  activities: "Dokumentasi Kegiatan",
  gallery: "Foto Galeri",
  members: "Anggota",
};

const selectColumns: Record<Exclude<ViewKey, "overview">, string> = {
  notes: "id, category, title, description, metadata, created_at",
  programs: "id, title, status, description, created_at",
  activities: "id, title, activity_date, description, created_at",
  gallery: "id, title, image_url, created_at",
  members: "id, name, role, division, study_program, created_at",
};

function cleanPayload<T extends Record<string, string>>(form: T) {
  return Object.fromEntries(
    Object.entries(form).map(([key, value]) => [key, value.trim() || null]),
  );
}

function getInitials(user: User | null) {
  const email = user?.email ?? "Admin";
  return email.slice(0, 2).toUpperCase();
}

export default function AdminPage() {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeView, setActiveView] = useState<ViewKey>("overview");
  const [records, setRecords] = useState<RecordsState>(emptyRecords);
  const [forms, setForms] = useState<FormState>(initialForms);
  const [editing, setEditing] = useState<EditingState>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supabaseConfigured = isSupabaseConfigured();
  const allowedAdminEmails = useMemo(
    () =>
      (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "admin@kkn.com")
        .split(",")
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean),
    [],
  );

  const isAllowedAdmin = (email?: string | null) =>
    Boolean(email && allowedAdminEmails.includes(email.toLowerCase()));

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | undefined;

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

      const nextUser = session?.user ?? null;
      setAuthUser(isAllowedAdmin(nextUser?.email) ? nextUser : null);
      setAuthChecking(false);

      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, nextSession) => {
          if (!isMounted) {
            return;
          }
          const user = nextSession?.user ?? null;
          setAuthUser(isAllowedAdmin(user?.email) ? user : null);
        },
      );

      unsubscribe = () => authListener.subscription.unsubscribe();
    };

    void initializeAuth();

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, [allowedAdminEmails]);

  const loadTable = async (table: Exclude<ViewKey, "overview">) => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return [];
    }

    const query = supabase.from(table).select(selectColumns[table]);
    const orderedQuery =
      table === "activities"
        ? query
            .order("activity_date", { ascending: false, nullsFirst: false })
            .order("created_at", { ascending: false })
        : query.order("created_at", { ascending: table === "members" });

    const { data, error: loadError } = await orderedQuery;

    if (loadError) {
      throw loadError;
    }

    return data ?? [];
  };

  const loadAll = async () => {
    if (!authUser) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [notes, programs, activities, gallery, members] = await Promise.all([
        loadTable("notes"),
        loadTable("programs"),
        loadTable("activities"),
        loadTable("gallery"),
        loadTable("members"),
      ]);

      setRecords({
        notes: notes as unknown as NoteRecord[],
        programs: programs as unknown as ProgramRecord[],
        activities: activities as unknown as ActivityRecord[],
        gallery: gallery as unknown as GalleryRecord[],
        members: members as unknown as MemberRecord[],
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authChecking && authUser) {
      void loadAll();
    }
  }, [authChecking, authUser]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const supabase = getSupabaseClient();
    if (!supabase) {
      setLoginError("Konfigurasi Supabase belum lengkap.");
      return;
    }

    setLoginLoading(true);
    setLoginError(null);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: loginForm.email.trim(),
      password: loginForm.password,
    });

    if (authError) {
      setLoginError(authError.message);
      setLoginLoading(false);
      return;
    }

    if (!isAllowedAdmin(data.user?.email)) {
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
    setRecords(emptyRecords);
    setLoginForm({ email: "", password: "" });
  };

  const resetForm = (table: Exclude<ViewKey, "overview">) => {
    setForms((current) => ({ ...current, [table]: initialForms[table] }));
    setEditing(null);
  };

  const updateForm = (
    table: Exclude<ViewKey, "overview">,
    field: string,
    value: string,
  ) => {
    setForms((current) => ({
      ...current,
      [table]: { ...current[table], [field]: value },
    }));
  };

  const startEdit = (table: Exclude<ViewKey, "overview">, record: RecordsState[typeof table][number]) => {
    if (table === "notes") {
      const item = record as NoteRecord;
      setForms((current) => ({
        ...current,
        notes: {
          category: item.category,
          title: item.title,
          description: item.description ?? "",
          metadata: item.metadata ?? "",
        },
      }));
    }

    if (table === "programs") {
      const item = record as ProgramRecord;
      setForms((current) => ({
        ...current,
        programs: {
          title: item.title,
          status: item.status,
          description: item.description ?? "",
        },
      }));
    }

    if (table === "activities") {
      const item = record as ActivityRecord;
      setForms((current) => ({
        ...current,
        activities: {
          title: item.title,
          activity_date: item.activity_date ?? "",
          description: item.description ?? "",
        },
      }));
    }

    if (table === "gallery") {
      const item = record as GalleryRecord;
      setForms((current) => ({
        ...current,
        gallery: {
          title: item.title ?? "",
          image_url: item.image_url ?? "",
        },
      }));
    }

    if (table === "members") {
      const item = record as MemberRecord;
      setForms((current) => ({
        ...current,
        members: {
          name: item.name,
          role: item.role ?? "",
          division: item.division ?? "",
          study_program: item.study_program ?? "",
        },
      }));
    }

    setEditing({ table, id: record.id });
    setActiveView(table);
    setMessage(null);
    setError(null);
  };

  const saveRecord = async (
    table: Exclude<ViewKey, "overview">,
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!supabaseConfigured || !authUser) {
      setError("Silakan login dan pastikan konfigurasi Supabase sudah lengkap.");
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return;
    }

    setSaving(true);
    setMessage(null);
    setError(null);

    const payload = cleanPayload(forms[table]);
    const activeEdit = editing?.table === table ? editing : null;
    const request = activeEdit
      ? supabase.from(table).update(payload).eq("id", activeEdit.id)
      : supabase.from(table).insert(payload);

    const { error: saveError } = await request;

    if (saveError) {
      setError(saveError.message);
      setSaving(false);
      return;
    }

    setMessage(
      `${tableLabels[table]} berhasil ${activeEdit ? "diperbarui" : "ditambahkan"}.`,
    );
    resetForm(table);
    await loadAll();
    setSaving(false);
  };

  const deleteRecord = async (table: Exclude<ViewKey, "overview">, id: string) => {
    const confirmed = window.confirm(`Hapus ${tableLabels[table].toLowerCase()} ini?`);
    if (!confirmed) {
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return;
    }

    setSaving(true);
    setMessage(null);
    setError(null);

    const { error: deleteError } = await supabase.from(table).delete().eq("id", id);

    if (deleteError) {
      setError(deleteError.message);
      setSaving(false);
      return;
    }

    setMessage(`${tableLabels[table]} berhasil dihapus.`);
    if (editing?.table === table && editing.id === id) {
      resetForm(table);
    }
    await loadAll();
    setSaving(false);
  };

  if (authChecking) {
    return (
      <main className="min-h-screen bg-[#F7F4ED] text-[#2C3B2E] flex items-center justify-center px-6">
        <p className="text-sm text-[#4A5D45]">Memeriksa sesi admin...</p>
      </main>
    );
  }

  if (!authUser) {
    return (
      <main className="min-h-screen bg-[#F7F4ED] text-[#2C3B2E]">
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
                <label className="block text-sm font-medium text-[#4A5D45]">
                  Email
                  <input
                    required
                    type="email"
                    value={loginForm.email}
                    onChange={(event) =>
                      setLoginForm((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    placeholder="nama@email.com"
                    className="mt-2 w-full rounded-xl border border-[#2C3B2E]/15 px-4 py-2.5 text-sm outline-none transition focus:border-[#C08A2E]"
                  />
                </label>
                <label className="block text-sm font-medium text-[#4A5D45]">
                  Password
                  <input
                    required
                    type="password"
                    value={loginForm.password}
                    onChange={(event) =>
                      setLoginForm((current) => ({
                        ...current,
                        password: event.target.value,
                      }))
                    }
                    placeholder="Password admin"
                    className="mt-2 w-full rounded-xl border border-[#2C3B2E]/15 px-4 py-2.5 text-sm outline-none transition focus:border-[#C08A2E]"
                  />
                </label>
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
              {!supabaseConfigured ? (
                <p className="mt-5 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700">
                  Konfigurasi Supabase belum lengkap.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F4ED] text-[#2C3B2E]">
      <div className="flex min-h-screen flex-col md:flex-row">
        <aside className="w-full border-b border-[#2C3B2E]/10 bg-[#EFE9DB] px-4 py-6 md:w-64 md:min-h-screen md:border-b-0 md:border-r">
          <div className="mb-8 flex items-center gap-3 px-2">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-[#C08A2E] bg-white p-0.5 shadow-sm">
              <img
                src="/logo-kkn.png"
                alt="Logo KKN Rancamanyar"
                className="h-full w-full rounded-full object-contain"
                decoding="async"
              />
            </div>
            <div>
              <p className="font-display text-sm font-semibold leading-tight">
                Rancamanyar
              </p>
              <p className="text-xs text-[#4A5D45]">Admin Panel</p>
            </div>
          </div>

          <nav className="grid grid-cols-2 gap-1 md:block md:space-y-1">
            {views.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveView(item.key)}
                className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                  activeView === item.key
                    ? "bg-white/90 text-[#2C3B2E] font-semibold"
                    : "text-[#4A5D45] hover:bg-white/60"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-8 w-full rounded-lg px-3 py-2.5 text-left text-sm text-[#4A5D45] transition-colors hover:bg-white/60"
          >
            Keluar
          </button>
        </aside>

        <section className="flex-1 min-h-screen">
          <div className="flex flex-col gap-3 border-b border-[#2C3B2E]/10 bg-white px-6 py-4 md:flex-row md:items-center md:justify-between md:px-10">
            <div>
              <p className="text-xs text-[#4A5D45]">Selamat datang,</p>
              <p className="font-display font-semibold">{authUser.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => void loadAll()}
                disabled={loading}
                className="rounded-xl border border-[#2C3B2E]/15 px-4 py-2 text-sm font-semibold text-[#2C3B2E] transition hover:border-[#2C3B2E] disabled:opacity-50"
              >
                {loading ? "Memuat..." : "Muat Ulang"}
              </button>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EFE9DB] text-xs font-semibold">
                {getInitials(authUser)}
              </div>
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

            {activeView === "overview" ? (
              <Overview records={records} />
            ) : null}

            {activeView === "notes" ? (
              <NotesView
                form={forms.notes}
                records={records.notes}
                editing={editing?.table === "notes" ? editing : null}
                saving={saving}
                onChange={(field, value) => updateForm("notes", field, value)}
                onSubmit={(event) => saveRecord("notes", event)}
                onEdit={(record) => startEdit("notes", record)}
                onDelete={(id) => deleteRecord("notes", id)}
                onCancel={() => resetForm("notes")}
              />
            ) : null}

            {activeView === "programs" ? (
              <ProgramsView
                form={forms.programs}
                records={records.programs}
                editing={editing?.table === "programs" ? editing : null}
                saving={saving}
                onChange={(field, value) => updateForm("programs", field, value)}
                onSubmit={(event) => saveRecord("programs", event)}
                onEdit={(record) => startEdit("programs", record)}
                onDelete={(id) => deleteRecord("programs", id)}
                onCancel={() => resetForm("programs")}
              />
            ) : null}

            {activeView === "activities" ? (
              <ActivitiesView
                form={forms.activities}
                records={records.activities}
                editing={editing?.table === "activities" ? editing : null}
                saving={saving}
                onChange={(field, value) => updateForm("activities", field, value)}
                onSubmit={(event) => saveRecord("activities", event)}
                onEdit={(record) => startEdit("activities", record)}
                onDelete={(id) => deleteRecord("activities", id)}
                onCancel={() => resetForm("activities")}
              />
            ) : null}

            {activeView === "gallery" ? (
              <GalleryView
                form={forms.gallery}
                records={records.gallery}
                editing={editing?.table === "gallery" ? editing : null}
                saving={saving}
                onChange={(field, value) => updateForm("gallery", field, value)}
                onSubmit={(event) => saveRecord("gallery", event)}
                onEdit={(record) => startEdit("gallery", record)}
                onDelete={(id) => deleteRecord("gallery", id)}
                onCancel={() => resetForm("gallery")}
              />
            ) : null}

            {activeView === "members" ? (
              <MembersView
                form={forms.members}
                records={records.members}
                editing={editing?.table === "members" ? editing : null}
                saving={saving}
                onChange={(field, value) => updateForm("members", field, value)}
                onSubmit={(event) => saveRecord("members", event)}
                onEdit={(record) => startEdit("members", record)}
                onDelete={(id) => deleteRecord("members", id)}
                onCancel={() => resetForm("members")}
              />
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}

function Overview({ records }: { records: RecordsState }) {
  const cards = [
    { label: "Catatan", value: records.notes.length },
    { label: "Program Kerja", value: records.programs.length },
    { label: "Dokumentasi", value: records.activities.length },
    { label: "Foto Galeri", value: records.gallery.length },
    { label: "Anggota", value: records.members.length },
  ];

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl font-semibold">Ringkasan</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-[#2C3B2E]/10 bg-white p-5"
          >
            <p className="mb-1 text-xs text-[#4A5D45]">{card.label}</p>
            <p className="font-display text-2xl font-semibold">{card.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-2xl border border-[#2C3B2E]/10 bg-white p-6 text-sm leading-relaxed text-[#4A5D45]">
        Semua angka di atas dibaca langsung dari Supabase. Setelah mengubah data,
        gunakan tombol muat ulang jika halaman publik masih menampilkan data lama.
      </div>
    </div>
  );
}

type CommonViewProps<TRecord, TForm> = {
  form: TForm;
  records: TRecord[];
  editing: EditingState;
  saving: boolean;
  onChange: (field: string, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onEdit: (record: TRecord) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-medium text-[#4A5D45]">
      {label}
      {children}
    </label>
  );
}

const inputClass =
  "mt-2 w-full rounded-xl border border-[#2C3B2E]/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#C08A2E]";

function FormActions({
  editing,
  saving,
  onCancel,
}: {
  editing: EditingState;
  saving: boolean;
  onCancel: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-[#C08A2E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a8791f] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? "Menyimpan..." : editing ? "Simpan Perubahan" : "Tambah Data"}
      </button>
      {editing ? (
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-[#2C3B2E]/15 px-5 py-2.5 text-sm font-semibold text-[#2C3B2E] transition hover:border-[#2C3B2E]"
        >
          Batal Edit
        </button>
      ) : null}
    </div>
  );
}

function RowActions<TRecord extends { id: string }>({
  record,
  onEdit,
  onDelete,
}: {
  record: TRecord;
  onEdit: (record: TRecord) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        onClick={() => onEdit(record)}
        className="rounded-lg border border-[#2C3B2E]/15 px-3 py-1.5 text-xs font-semibold text-[#2C3B2E] hover:border-[#2C3B2E]"
      >
        Edit
      </button>
      <button
        type="button"
        onClick={() => onDelete(record.id)}
        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:border-red-400"
      >
        Hapus
      </button>
    </div>
  );
}

function EmptyTable({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#2C3B2E]/20 bg-white/60 p-6 text-sm text-[#4A5D45]">
      {label} belum ada.
    </div>
  );
}

function NotesView({
  form,
  records,
  editing,
  saving,
  onChange,
  onSubmit,
  onEdit,
  onDelete,
  onCancel,
}: CommonViewProps<NoteRecord, FormState["notes"]>) {
  return (
    <Section title="Pencatatan" subtitle="Kelola catatan yang tampil di papan pencatatan website.">
      <form onSubmit={onSubmit} className="mb-6 rounded-2xl border border-[#2C3B2E]/10 bg-white p-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Kategori">
            <select
              value={form.category}
              onChange={(event) => onChange("category", event.target.value)}
              className={inputClass}
            >
              <option value="Kehadiran">Kehadiran</option>
              <option value="Keuangan">Keuangan</option>
              <option value="Progres Proker">Progres Proker</option>
              <option value="Logistik">Logistik</option>
              <option value="Humas">Humas</option>
              <option value="Konsumsi">Konsumsi</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </Field>
          <Field label="Metadata / Penulis">
            <input
              value={form.metadata}
              onChange={(event) => onChange("metadata", event.target.value)}
              className={inputClass}
              placeholder="Contoh: 20 Juli 2026 oleh Cipa"
            />
          </Field>
        </div>
        <Field label="Judul">
          <input
            required
            value={form.title}
            onChange={(event) => onChange("title", event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Catatan">
          <textarea
            required
            value={form.description}
            onChange={(event) => onChange("description", event.target.value)}
            rows={4}
            className={`${inputClass} resize-none`}
          />
        </Field>
        <FormActions editing={editing} saving={saving} onCancel={onCancel} />
      </form>

      {records.length === 0 ? (
        <EmptyTable label="Catatan" />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#2C3B2E]/10 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2C3B2E]/10 text-left text-xs text-[#4A5D45]">
                <th className="px-6 py-3 font-medium">Kategori</th>
                <th className="px-6 py-3 font-medium">Judul</th>
                <th className="px-6 py-3 font-medium hidden md:table-cell">Oleh</th>
                <th className="px-6 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-b border-[#2C3B2E]/5 align-top">
                  <td className="px-6 py-3 text-[#4A5D45]">{record.category}</td>
                  <td className="px-6 py-3 font-medium">{record.title}</td>
                  <td className="px-6 py-3 hidden md:table-cell text-[#4A5D45]">{record.metadata || "Admin"}</td>
                  <td className="px-6 py-3"><RowActions record={record} onEdit={onEdit} onDelete={onDelete} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Section>
  );
}

function ProgramsView({
  form,
  records,
  editing,
  saving,
  onChange,
  onSubmit,
  onEdit,
  onDelete,
  onCancel,
}: CommonViewProps<ProgramRecord, FormState["programs"]>) {
  return (
    <Section title="Program Kerja" subtitle="Kelola program kerja yang tampil di halaman utama.">
      <form onSubmit={onSubmit} className="mb-6 rounded-2xl border border-[#2C3B2E]/10 bg-white p-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nama Program">
            <input required value={form.title} onChange={(event) => onChange("title", event.target.value)} className={inputClass} />
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={(event) => onChange("status", event.target.value)} className={inputClass}>
              <option value="Rencana">Rencana</option>
              <option value="Berjalan">Berjalan</option>
              <option value="Selesai">Selesai</option>
            </select>
          </Field>
        </div>
        <Field label="Deskripsi">
          <textarea value={form.description} onChange={(event) => onChange("description", event.target.value)} rows={4} className={`${inputClass} resize-none`} />
        </Field>
        <FormActions editing={editing} saving={saving} onCancel={onCancel} />
      </form>

      {records.length === 0 ? (
        <EmptyTable label="Program kerja" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {records.map((record) => (
            <div key={record.id} className="rounded-2xl border border-[#2C3B2E]/10 bg-white p-5">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-[#C08A2E]">{record.status}</p>
                  <h3 className="font-display text-lg font-semibold">{record.title}</h3>
                </div>
                <RowActions record={record} onEdit={onEdit} onDelete={onDelete} />
              </div>
              <p className="text-sm leading-relaxed text-[#4A5D45]">{record.description || "Belum ada deskripsi."}</p>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

function ActivitiesView({
  form,
  records,
  editing,
  saving,
  onChange,
  onSubmit,
  onEdit,
  onDelete,
  onCancel,
}: CommonViewProps<ActivityRecord, FormState["activities"]>) {
  return (
    <Section title="Dokumentasi" subtitle="Kelola cerita kegiatan dan tanggal pelaksanaannya.">
      <form onSubmit={onSubmit} className="mb-6 rounded-2xl border border-[#2C3B2E]/10 bg-white p-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Judul Kegiatan">
            <input required value={form.title} onChange={(event) => onChange("title", event.target.value)} className={inputClass} />
          </Field>
          <Field label="Tanggal">
            <input type="date" value={form.activity_date} onChange={(event) => onChange("activity_date", event.target.value)} className={inputClass} />
          </Field>
        </div>
        <Field label="Deskripsi">
          <textarea value={form.description} onChange={(event) => onChange("description", event.target.value)} rows={4} className={`${inputClass} resize-none`} />
        </Field>
        <FormActions editing={editing} saving={saving} onCancel={onCancel} />
      </form>

      {records.length === 0 ? (
        <EmptyTable label="Dokumentasi" />
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <div key={record.id} className="rounded-2xl border border-[#2C3B2E]/10 bg-white p-5">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-[#C08A2E]">{formatDate(record.activity_date)}</p>
                  <h3 className="font-display text-lg font-semibold">{record.title}</h3>
                </div>
                <RowActions record={record} onEdit={onEdit} onDelete={onDelete} />
              </div>
              <p className="text-sm leading-relaxed text-[#4A5D45]">{record.description || "Belum ada deskripsi."}</p>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

function GalleryView({
  form,
  records,
  editing,
  saving,
  onChange,
  onSubmit,
  onEdit,
  onDelete,
  onCancel,
}: CommonViewProps<GalleryRecord, FormState["gallery"]>) {
  return (
    <Section title="Galeri" subtitle="Tambahkan URL foto dari Supabase Storage, Drive publik, atau hosting gambar lain.">
      <form onSubmit={onSubmit} className="mb-6 rounded-2xl border border-[#2C3B2E]/10 bg-white p-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Judul Foto">
            <input value={form.title} onChange={(event) => onChange("title", event.target.value)} className={inputClass} />
          </Field>
          <Field label="URL Gambar">
            <input required type="url" value={form.image_url} onChange={(event) => onChange("image_url", event.target.value)} className={inputClass} placeholder="https://..." />
          </Field>
        </div>
        {form.image_url ? (
          <img src={form.image_url} alt="Pratinjau foto" className="h-32 w-32 rounded-xl object-cover border border-[#2C3B2E]/10" />
        ) : null}
        <FormActions editing={editing} saving={saving} onCancel={onCancel} />
      </form>

      {records.length === 0 ? (
        <EmptyTable label="Foto" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {records.map((record) => (
            <div key={record.id} className="overflow-hidden rounded-2xl border border-[#2C3B2E]/10 bg-white">
              {record.image_url ? (
                <img src={record.image_url} alt={record.title || "Foto galeri"} className="aspect-square w-full object-cover" />
              ) : null}
              <div className="p-4">
                <p className="mb-3 text-sm font-semibold">{record.title || "Tanpa judul"}</p>
                <RowActions record={record} onEdit={onEdit} onDelete={onDelete} />
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

function MembersView({
  form,
  records,
  editing,
  saving,
  onChange,
  onSubmit,
  onEdit,
  onDelete,
  onCancel,
}: CommonViewProps<MemberRecord, FormState["members"]>) {
  return (
    <Section title="Anggota" subtitle="Kelola nama, jabatan, divisi, dan program studi anggota KKN.">
      <form onSubmit={onSubmit} className="mb-6 rounded-2xl border border-[#2C3B2E]/10 bg-white p-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nama">
            <input required value={form.name} onChange={(event) => onChange("name", event.target.value)} className={inputClass} />
          </Field>
          <Field label="Jabatan">
            <input value={form.role} onChange={(event) => onChange("role", event.target.value)} className={inputClass} placeholder="Ketua, Sekretaris, Anggota" />
          </Field>
          <Field label="Divisi">
            <input value={form.division} onChange={(event) => onChange("division", event.target.value)} className={inputClass} placeholder="Divisi Acara" />
          </Field>
          <Field label="Program Studi">
            <input value={form.study_program} onChange={(event) => onChange("study_program", event.target.value)} className={inputClass} />
          </Field>
        </div>
        <FormActions editing={editing} saving={saving} onCancel={onCancel} />
      </form>

      {records.length === 0 ? (
        <EmptyTable label="Anggota" />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#2C3B2E]/10 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2C3B2E]/10 text-left text-xs text-[#4A5D45]">
                <th className="px-6 py-3 font-medium">Nama</th>
                <th className="px-6 py-3 font-medium hidden md:table-cell">Jabatan</th>
                <th className="px-6 py-3 font-medium hidden md:table-cell">Divisi</th>
                <th className="px-6 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-b border-[#2C3B2E]/5 align-top">
                  <td className="px-6 py-3 font-medium">{record.name}</td>
                  <td className="px-6 py-3 hidden md:table-cell text-[#4A5D45]">{record.role || "Anggota"}</td>
                  <td className="px-6 py-3 hidden md:table-cell text-[#4A5D45]">{record.division || "-"}</td>
                  <td className="px-6 py-3"><RowActions record={record} onEdit={onEdit} onDelete={onDelete} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Section>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-[#4A5D45]">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
