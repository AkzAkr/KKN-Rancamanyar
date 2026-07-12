"use client";

import { useEffect, useMemo, useState } from "react";
import type { NoteRecord } from "@/lib/content-types";
import { getSupabaseClient } from "@/lib/supabase/client";

function chunkNotes(notes: NoteRecord[], size = 6): NoteRecord[][] {
  const pages: NoteRecord[][] = [];
  for (let index = 0; index < notes.length; index += size) {
    pages.push(notes.slice(index, index + size));
  }
  return pages;
}

function NoteCard({ note, index }: { note: NoteRecord; index: number }) {
  const rotateClass = index % 2 === 0 ? "-rotate-2" : "rotate-1";
  const badgeClass = index % 2 === 0 ? "bg-[#C08A2E]/70" : "bg-[#4A5D45]/60";
  const badgeRotateClass = index % 2 === 0 ? "rotate-1" : "-rotate-2";

  return (
    <div
      className={`relative rounded-xl bg-white p-5 shadow-lg ring-1 ring-[#2C3B2E]/5 ${rotateClass} transition-transform duration-300 hover:rotate-0`}
    >
      <div
        className={`absolute -top-3 left-1/2 h-6 w-14 -translate-x-1/2 ${badgeClass} ${badgeRotateClass} shadow-sm`}
      />
      <p className="label-eyebrow mb-2">{note.category}</p>
      <h3 className="font-display mb-2 text-lg font-semibold leading-tight">
        {note.title}
      </h3>
      <p className="text-sm leading-relaxed text-[#4A5D45]">
        {note.description || "Belum ada rincian catatan."}
      </p>
      <p className="mt-3 text-xs text-[#4A5D45]/60">
        {note.metadata || "Admin"}
      </p>
    </div>
  );
}

export default function Mading() {
  const [notes, setNotes] = useState<NoteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      setLoading(false);
      return;
    }

    const loadNotes = async () => {
      const { data } = await supabase
        .from("notes")
        .select("id, category, title, description, metadata, created_at")
        .order("created_at", { ascending: false });

      setNotes(data ?? []);
      setLoading(false);
    };

    void loadNotes();
  }, []);

  const pages = useMemo(() => chunkNotes(notes, 6), [notes]);
  const totalPages = pages.length;

  useEffect(() => {
    setCurrentPage(0);
  }, [totalPages]);

  const goPrev = () => setCurrentPage((page) => Math.max(0, page - 1));
  const goNext = () =>
    setCurrentPage((page) => Math.min(totalPages - 1, page + 1));

  return (
    <section
      id="pencatatan"
      className="section-shell py-24 px-6 border-t border-[#2C3B2E]/10"
    >
      <div className="relative max-w-6xl mx-auto">
        <div className="max-w-2xl mb-16">
          <p className="label-eyebrow mb-3">Papan Pencatatan</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold mb-4 leading-tight">
            Catatan Kelompok
          </h2>
          <p className="text-[#4A5D45] leading-relaxed text-base md:text-lg">
            Rekap singkat seputar kas, kehadiran, dan progres harian kelompok,
            diperbarui rutin lewat admin panel.
          </p>
        </div>

        <div className="relative rounded-3xl border border-[#2C3B2E]/10 bg-[#EFE9DB] px-6 md:px-10 py-14 overflow-hidden shadow-inner shadow-[#2C3B2E]/5">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #2c3b2e 1px, transparent 1px)",
              backgroundSize: "14px 14px",
            }}
          />

          {loading ? (
            <div className="relative rounded-2xl bg-white/70 p-7 text-sm text-[#4A5D45]">
              Memuat catatan...
            </div>
          ) : notes.length === 0 ? (
            <div className="relative rounded-2xl border border-dashed border-[#2C3B2E]/20 bg-white/70 p-7 text-sm text-[#4A5D45]">
              Belum ada catatan. Tambahkan catatan pertama lewat admin panel.
            </div>
          ) : (
            <>
              <div className="relative overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentPage * 100}%)` }}
                >
                  {pages.map((page, pageIndex) => (
                    <div
                      key={pageIndex}
                      className="mading-page w-full shrink-0 grid gap-x-6 gap-y-10 px-1 sm:grid-cols-2 lg:grid-cols-3"
                    >
                      {page.map((note, noteIndex) => (
                        <NoteCard
                          key={note.id}
                          note={note}
                          index={noteIndex}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative flex items-center justify-center gap-6 mt-10">
                <button
                  onClick={goPrev}
                  disabled={currentPage === 0}
                  className="w-10 h-10 rounded-full bg-white border border-[#2C3B2E]/10 flex items-center justify-center text-[#2C3B2E] hover:bg-[#2C3B2E] hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-[#2C3B2E]"
                  aria-label="Catatan sebelumnya"
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
                  {pages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index)}
                      className={`mading-dot h-2.5 w-2.5 rounded-full transition-colors ${
                        index === currentPage
                          ? "bg-[#2C3B2E]"
                          : "bg-[#2C3B2E]/25"
                      }`}
                      aria-label={`Buka halaman catatan ${index + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={goNext}
                  disabled={currentPage === totalPages - 1}
                  className="w-10 h-10 rounded-full bg-white border border-[#2C3B2E]/10 flex items-center justify-center text-[#2C3B2E] hover:bg-[#2C3B2E] hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-[#2C3B2E]"
                  aria-label="Catatan berikutnya"
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
            </>
          )}
        </div>
      </div>
    </section>
  );
}
