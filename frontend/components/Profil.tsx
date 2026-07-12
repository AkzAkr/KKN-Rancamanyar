"use client";

import { useEffect, useMemo, useState } from "react";
import type { MemberRecord } from "@/lib/content-types";
import { getSupabaseClient } from "@/lib/supabase/client";

function groupByDivision(members: MemberRecord[]) {
  return members.reduce<Record<string, MemberRecord[]>>((groups, member) => {
    const key = member.division?.trim() || "Tanpa Divisi";
    groups[key] = groups[key] ?? [];
    groups[key].push(member);
    return groups;
  }, {});
}

export default function Profil() {
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      setLoading(false);
      return;
    }

    const loadMembers = async () => {
      const { data } = await supabase
        .from("members")
        .select("id, name, role, division, study_program, created_at")
        .order("created_at", { ascending: true });

      setMembers(data ?? []);
      setLoading(false);
    };

    void loadMembers();
  }, []);

  const leaders = useMemo(
    () => members.filter((member) => Boolean(member.role?.trim())),
    [members],
  );

  const divisionGroups = useMemo(() => groupByDivision(members), [members]);

  return (
    <section
      id="profil"
      className="section-shell py-24 px-6 border-t border-[#2C3B2E]/10"
    >
      <div className="relative max-w-6xl mx-auto">
        <div className="mb-14 grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div className="max-w-2xl">
          <p className="label-eyebrow mb-3">Profil Kelompok</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold mb-4 leading-tight">
            Siapa Kami
          </h2>
          <p className="text-[#4A5D45] leading-relaxed text-base md:text-lg">
            Beranggotakan mahasiswa lintas jurusan, kelompok kami ditempatkan
            di Desa Rancamanyar dengan dampingan dosen pembimbing lapangan
            sepanjang program berjalan.
          </p>
          </div>
          <div className="soft-panel rounded-2xl p-5 text-sm leading-relaxed text-[#4A5D45]">
            Data profil di bawah ini dikelola langsung dari admin panel, jadi
            struktur anggota dan divisi selalu mengikuti pembaruan terbaru.
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-[#2C3B2E]/10 bg-white p-7 text-sm text-[#4A5D45]">
            Memuat profil anggota...
          </div>
        ) : members.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#2C3B2E]/20 bg-white/60 p-7 text-sm text-[#4A5D45]">
            Profil anggota belum ditambahkan.
          </div>
        ) : (
          <>
            {leaders.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
                {leaders.slice(0, 6).map((member, index) => (
                  <div
                    key={member.id}
                    className="content-card rounded-2xl p-6 card-hover overflow-hidden relative"
                  >
                    <div className="absolute right-5 top-5 font-display text-5xl font-semibold text-[#2C3B2E]/5">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EFE9DB] ring-1 ring-[#C08A2E]/20">
                      <span className="font-display text-lg text-[#C08A2E] font-semibold">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#4A5D45]/70">
                      {member.role}
                    </p>
                    <p className="font-display font-semibold text-xl leading-tight">
                      {member.name}
                    </p>
                    {member.study_program ? (
                      <p className="mt-3 text-xs text-[#4A5D45]">
                        {member.study_program}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Object.entries(divisionGroups).map(([division, items]) => (
                <div
                  key={division}
                  className="content-card rounded-2xl p-6 card-hover"
                >
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <p className="label-eyebrow">{division}</p>
                    <span className="rounded-full bg-[#EFE9DB] px-3 py-1 text-xs font-semibold text-[#4A5D45]">
                      {items.length} orang
                    </span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    {items.map((member) => (
                      <li
                        key={member.id}
                        className="flex items-center gap-2 font-medium text-[#2C3B2E]"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[#C08A2E]" />
                        {member.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="rounded-2xl border border-[#2C3B2E]/10 bg-[#2C3B2E] p-6 text-center text-[#F7F4ED] shadow-lg shadow-[#2C3B2E]/10 flex flex-col justify-center items-center">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#F7F4ED]/70">
                  Total Anggota
                </p>
                <p className="font-display text-5xl font-semibold">
                  {members.length}
                </p>
                <p className="mt-2 text-xs text-[#F7F4ED]/75">Mahasiswa</p>
              </div>
            </div>

            <div className="mt-16">
              <div className="flex items-end justify-between gap-6 mb-6">
                <p className="label-eyebrow">Seluruh Anggota</p>
                <p className="text-xs text-[#4A5D45]/60 hidden sm:block">
                  Geser untuk melihat lainnya
                </p>
              </div>
              <div className="relative">
                <div className="member-scroll flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 sm:mx-0 sm:px-0 scroll-smooth snap-x snap-mandatory">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="member-card content-card snap-start shrink-0 w-44 rounded-2xl p-4 card-hover text-center"
                    >
                      <div className="mb-4 flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br from-[#EFE9DB] to-white ring-1 ring-[#2C3B2E]/5">
                        <span className="font-display text-4xl font-semibold text-[#C08A2E]">
                          {member.name.slice(0, 1).toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm font-semibold leading-snug">
                        {member.name}
                      </p>
                      <p className="mt-1 text-xs text-[#4A5D45]">
                        {member.study_program || member.role || "Anggota"}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-[#F7F4ED] to-transparent sm:from-[#F7F4ED]"></div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
