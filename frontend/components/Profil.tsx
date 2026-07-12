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
    <section id="profil" className="py-24 px-6 border-t border-[#2C3B2E]/10">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mb-14">
          <p className="label-eyebrow mb-3">Profil Kelompok</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
            Siapa Kami
          </h2>
          <p className="text-[#4A5D45] leading-relaxed">
            Beranggotakan mahasiswa lintas jurusan, kelompok kami ditempatkan
            di Desa Rancamanyar dengan dampingan dosen pembimbing lapangan
            sepanjang program berjalan.
          </p>
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
              <div className="grid md:grid-cols-3 gap-6 mb-14">
                {leaders.slice(0, 6).map((member, index) => (
                  <div
                    key={member.id}
                    className="bg-white rounded-2xl p-6 border border-[#2C3B2E]/10 card-hover"
                  >
                    <div className="w-11 h-11 rounded-full bg-[#EFE9DB] flex items-center justify-center mb-4">
                      <span className="font-display text-[#C08A2E] font-semibold">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p className="text-xs text-[#4A5D45] mb-1">
                      {member.role}
                    </p>
                    <p className="font-display font-semibold text-lg">
                      {member.name}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Object.entries(divisionGroups).map(([division, items]) => (
                <div
                  key={division}
                  className="bg-white rounded-2xl p-6 border border-[#2C3B2E]/10 card-hover"
                >
                  <p className="label-eyebrow mb-3">{division}</p>
                  <ul className="space-y-1.5 text-sm">
                    {items.map((member) => (
                      <li key={member.id} className="font-medium">
                        {member.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="bg-white rounded-2xl p-6 border border-[#2C3B2E]/10 card-hover flex flex-col justify-center items-center text-center">
                <p className="text-xs text-[#4A5D45] mb-1">Total Anggota</p>
                <p className="font-display text-3xl font-semibold text-[#2C3B2E]">
                  {members.length}
                </p>
                <p className="text-xs text-[#4A5D45] mt-1">Mahasiswa</p>
              </div>
            </div>

            <div className="mt-16">
              <div className="flex items-center justify-between mb-6">
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
                      className="member-card snap-start shrink-0 w-40 bg-white rounded-2xl p-4 border border-[#2C3B2E]/10 card-hover text-center"
                    >
                      <div className="aspect-square rounded-xl bg-[#EFE9DB] mb-3 flex items-center justify-center">
                        <span className="font-display text-2xl font-semibold text-[#C08A2E]">
                          {member.name.slice(0, 1).toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm font-semibold">{member.name}</p>
                      <p className="text-xs text-[#4A5D45]">
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
