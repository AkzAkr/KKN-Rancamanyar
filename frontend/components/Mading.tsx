"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

type Note = {
  id?: string;
  category: string;
  title: string;
  description: string;
  metadata: string | null;
  created_at?: string | null;
};

const FALLBACK_PAGE_1: Note[] = [
  {
    category: "Kehadiran",
    title: "Rekap Minggu 1",
    description:
      "17 anggota hadir penuh selama minggu pertama. Tidak ada catatan absen.",
    metadata: "12 Juli 2026 · oleh Cipa",
  },
  {
    category: "Keuangan",
    title: "Kas Mingguan",
    description:
      "Pemasukan Rp850.000, pengeluaran konsumsi & logistik Rp420.000. Sisa kas Rp430.000.",
    metadata: "12 Juli 2026 · oleh Risa",
  },
  {
    category: "Progres Proker",
    title: "Digitalisasi UMKM",
    description:
      "Sesi 1 selesai, 15 pelaku usaha ikut. Sesi 2 dijadwalkan minggu depan.",
    metadata: "10 Juli 2026 · oleh Div. Acara",
  },
  {
    category: "Logistik",
    title: "Inventaris Alat",
    description:
      "Proyektor & sound system dipinjam dari kelurahan, kondisi baik, dikembalikan H+1 kegiatan.",
    metadata: "9 Juli 2026 · oleh Rifki",
  },
  {
    category: "Humas",
    title: "Koordinasi Kelurahan",
    description:
      "Izin kegiatan bimbel disetujui, jadwal disesuaikan agar tidak bentrok pengajian rutin.",
    metadata: "8 Juli 2026 · oleh Gio",
  },
  {
    category: "Konsumsi",
    title: "Rekap Belanja",
    description:
      "Belanja bahan konsumsi untuk 3 kegiatan minggu ini, struk tersimpan bersama bendahara.",
    metadata: "7 Juli 2026 · oleh Siti Anisa",
  },
];

const FALLBACK_PAGE_2: Note[] = [
  {
    category: "Kehadiran",
    title: "Rekap Minggu 2",
    description: "16 anggota hadir, 1 izin sakit dengan surat keterangan.",
    metadata: "19 Juli 2026 · oleh Cipa",
  },
  {
    category: "Keuangan",
    title: "Donasi Sponsor",
    description:
      "Bantuan dana Rp500.000 dari toko mitra untuk kegiatan bimbel.",
    metadata: "18 Juli 2026 · oleh Risa",
  },
  {
    category: "Progres Proker",
    title: "Bimbingan Belajar",
    description:
      "Hari pertama bimbel diikuti 22 anak SD-SMP, antusiasme tinggi.",
    metadata: "17 Juli 2026 · oleh Div. Acara",
  },
  {
    category: "Logistik",
    title: "Perbaikan Sound System",
    description:
      "Sound system rusak ringan, diperbaiki bengkel desa, biaya Rp75.000.",
    metadata: "16 Juli 2026 · oleh Rifki",
  },
  {
    category: "Humas",
    title: "Publikasi Media Sosial",
    description:
      "Unggahan dokumentasi bimbel mendapat 300+ likes dan diliput radio lokal.",
    metadata: "15 Juli 2026 · oleh Gio",
  },
  {
    category: "Konsumsi",
    title: "Snack Kegiatan",
    description:
      "Konsumsi untuk 22 anak bimbel disiapkan swadaya, dana dari kas mingguan.",
    metadata: "14 Juli 2026 · oleh Siti Anisa",
  },
];

const FALLBACK_PAGES = [FALLBACK_PAGE_1, FALLBACK_PAGE_2];

function chunkNotes(notes: Note[], size = 6): Note[][] {
  const pages: Note[][] = [];
  for (let index = 0; index < notes.length; index += size) {
    pages.push(notes.slice(index, index + size));
  }
  return pages.length > 0 ? pages : [[]];
}

function NoteCard({ note, index }: { note: Note; index: number }) {
  const rotateClass = index % 2 === 0 ? "-rotate-2" : "rotate-1";
  const badgeClass = index % 2 === 0 ? "bg-[#C08A2E]/70" : "bg-[#4A5D45]/60";
  const badgeRotateClass = index % 2 === 0 ? "rotate-1" : "-rotate-2";

  return (
    <div
      className={`relative rounded-lg bg-white p-5 shadow-lg ${rotateClass} transition-transform duration-300 hover:rotate-0`}
    >
      <div
        className={`absolute -top-3 left-1/2 h-6 w-14 -translate-x-1/2 ${badgeClass} ${badgeRotateClass} shadow-sm`}
      />
      <p className="label-eyebrow mb-2">{note.category}</p>
      <h3 className="font-display mb-1 font-semibold">{note.title}</h3>
      <p className="text-sm leading-relaxed text-[#4A5D45]">
        {note.description}
      </p>
      <p className="mt-3 text-xs text-[#4A5D45]/60">{note.metadata}</p>
    </div>
  );
}

export default function Mading() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      setNotes([]);
      return;
    }

    const loadNotes = async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("id, category, title, description, metadata, created_at")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setNotes(
          data.map((item) => ({
            id: item.id,
            category: item.category,
            title: item.title,
            description: item.description ?? "",
            metadata: item.metadata,
            created_at: item.created_at,
          })),
        );
      } else {
        setNotes([]);
      }
    };

    void loadNotes();
  }, []);

  const pages = useMemo(() => {
    const source =
      notes.length > 0 ? notes : FALLBACK_PAGE_1.concat(FALLBACK_PAGE_2);
    return chunkNotes(source, 6);
  }, [notes]);

  const totalPages = pages.length;

  useEffect(() => {
    setCurrentPage(0);
  }, [totalPages]);

  const goPrev = () => setCurrentPage((p) => Math.max(0, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <section
      id="pencatatan"
      className="py-24 px-6 border-t border-[#2C3B2E]/10"
    >
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mb-16">
          <p className="label-eyebrow mb-3">Papan Pencatatan</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
            Catatan Kelompok
          </h2>
          <p className="text-[#4A5D45] leading-relaxed">
            Rekap singkat seputar kas, kehadiran, dan progres harian kelompok —
            ditempel seperti mading, diperbarui rutin oleh sekretaris dan
            bendahara.
          </p>
        </div>

        <div className="relative bg-[#EFE9DB] rounded-3xl border border-[#2C3B2E]/10 px-6 md:px-10 py-14 overflow-hidden">
          {/* cork texture */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #2c3b2e 1px, transparent 1px)",
              backgroundSize: "14px 14px",
            }}
          ></div>

          {/* slider track */}
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentPage * 100}%)` }}
            >
              {pages.map((page, i) => (
                <div
                  key={i}
                  className="mading-page w-full shrink-0 grid gap-x-6 gap-y-10 px-1 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {page.map((note, noteIndex) => (
                    <NoteCard
                      key={note.title + noteIndex}
                      note={note}
                      index={noteIndex}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* navigasi */}
          <div className="relative flex items-center justify-center gap-6 mt-10">
            <button
              onClick={goPrev}
              disabled={currentPage === 0}
              className="w-10 h-10 rounded-full bg-white border border-[#2C3B2E]/10 flex items-center justify-center text-[#2C3B2E] hover:bg-[#2C3B2E] hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-[#2C3B2E]"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              {pages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`mading-dot h-2.5 w-2.5 rounded-full transition-colors ${
                    i === currentPage ? "bg-[#2C3B2E]" : "bg-[#2C3B2E]/25"
                  }`}
                  data-page={i}
                ></button>
              ))}
            </div>
            <button
              onClick={goNext}
              disabled={currentPage === totalPages - 1}
              className="w-10 h-10 rounded-full bg-white border border-[#2C3B2E]/10 flex items-center justify-center text-[#2C3B2E] hover:bg-[#2C3B2E] hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-[#2C3B2E]"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
