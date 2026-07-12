"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

const INITIAL_STATS = {
  members: 0,
  programs: 0,
  activities: 0,
};

export default function Hero() {
  const [stats, setStats] = useState(INITIAL_STATS);

  useEffect(() => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return;
    }

    const loadStats = async () => {
      const [members, programs, activities] = await Promise.all([
        supabase.from("members").select("id", { count: "exact", head: true }),
        supabase.from("programs").select("id", { count: "exact", head: true }),
        supabase.from("activities").select("id", { count: "exact", head: true }),
      ]);

      setStats({
        members: members.count ?? 0,
        programs: programs.count ?? 0,
        activities: activities.count ?? 0,
      });
    };

    void loadStats();
  }, []);

  return (
    <section className="section-shell relative pt-40 pb-28 px-6 mountain-texture overflow-hidden">
      <svg
        className="absolute top-16 left-1/2 -translate-x-1/2 w-[640px] max-w-[90vw] opacity-70"
        height="140"
        viewBox="0 0 640 140"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M20 130 A 300 300 0 0 1 300 20"
          stroke="#C08A2E"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M340 20 A 300 300 0 0 1 620 130"
          stroke="#C08A2E"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <p className="label-eyebrow mb-5">Desa Rancamanyar &middot; 2026</p>
        <h1 className="font-display text-5xl md:text-7xl font-semibold leading-[1.04] mb-6">
          Belajar, Berkarya,
          <br />
          Mengabdi Bersama
        </h1>
        <p className="text-[#4A5D45] text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
          Kelompok Kuliah Kerja Nyata Rancamanyar hadir untuk tumbuh bersama
          masyarakat, mencatat setiap langkah pengabdian dari rencana hingga
          cerita di lapangan.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <a
            href="#program"
            className="px-6 py-3 rounded-full bg-[#2C3B2E] text-[#F7F4ED] text-sm font-semibold hover:bg-[#3d5138] transition-colors"
          >
            Lihat Program Kerja
          </a>
          <a
            href="#dokumentasi"
            className="px-6 py-3 rounded-full border border-[#2C3B2E]/30 text-sm font-semibold text-[#2C3B2E] hover:border-[#2C3B2E] transition-colors"
          >
            Dokumentasi Kegiatan
          </a>
        </div>

        <div className="soft-panel grid grid-cols-3 max-w-xl mx-auto gap-0 overflow-hidden rounded-2xl">
          <div className="p-5">
            <p className="font-display text-4xl font-semibold text-[#2C3B2E]">
              {stats.members}
            </p>
            <p className="text-xs font-semibold text-[#4A5D45] mt-1">Anggota Tim</p>
          </div>
          <div className="border-x border-[#2C3B2E]/10 p-5">
            <p className="font-display text-4xl font-semibold text-[#2C3B2E]">
              {stats.programs}
            </p>
            <p className="text-xs font-semibold text-[#4A5D45] mt-1">Program Kerja</p>
          </div>
          <div className="p-5">
            <p className="font-display text-4xl font-semibold text-[#2C3B2E]">
              {stats.activities}
            </p>
            <p className="text-xs font-semibold text-[#4A5D45] mt-1">Dokumentasi</p>
          </div>
        </div>
      </div>
    </section>
  );
}
