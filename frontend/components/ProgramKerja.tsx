"use client";

import { useEffect, useState } from "react";
import type { ProgramRecord } from "@/lib/content-types";
import { statusClass } from "@/lib/content-utils";
import { getSupabaseClient } from "@/lib/supabase/client";

export default function ProgramKerja() {
  const [programs, setPrograms] = useState<ProgramRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      setLoading(false);
      return;
    }

    const loadPrograms = async () => {
      const { data } = await supabase
        .from("programs")
        .select("id, title, status, description, created_at")
        .order("created_at", { ascending: false });

      setPrograms(data ?? []);
      setLoading(false);
    };

    void loadPrograms();
  }, []);

  return (
    <section
      id="program"
      className="section-shell py-24 px-6 bg-[#EFE9DB]/50 border-t border-[#2C3B2E]/10"
    >
      <div className="relative max-w-6xl mx-auto">
        <div className="max-w-2xl mb-14">
          <p className="label-eyebrow mb-3">Program Kerja</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold mb-4 leading-tight">
            Apa yang Kami Kerjakan
          </h2>
          <p className="text-[#4A5D45] leading-relaxed text-base md:text-lg">
            Rangkaian program yang dirancang bersama warga, disesuaikan
            dengan kebutuhan Desa Rancamanyar.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-[#2C3B2E]/10 bg-white p-7 text-sm text-[#4A5D45]">
            Memuat program kerja...
          </div>
        ) : programs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#2C3B2E]/20 bg-white/60 p-7 text-sm text-[#4A5D45]">
            Program kerja belum ditambahkan.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {programs.map((program) => (
              <div
                key={program.id}
                className="content-card rounded-2xl p-7 card-hover"
              >
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${statusClass(program.status)}`}
                >
                  {program.status}
                </span>
                <h3 className="font-display text-2xl font-semibold mb-3 leading-tight">
                  {program.title}
                </h3>
                <p className="text-sm text-[#4A5D45] leading-relaxed">
                  {program.description || "Belum ada deskripsi."}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
