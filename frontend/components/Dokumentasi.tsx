"use client";

import { useEffect, useState } from "react";
import type { ActivityRecord } from "@/lib/content-types";
import { formatDate } from "@/lib/content-utils";
import { getSupabaseClient } from "@/lib/supabase/client";

export default function Dokumentasi() {
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      setLoading(false);
      return;
    }

    const loadActivities = async () => {
      const { data } = await supabase
        .from("activities")
        .select("id, title, activity_date, description, image_url, created_at")
        .order("activity_date", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false });

      setActivities(data ?? []);
      setLoading(false);
    };

    void loadActivities();
  }, []);

  return (
    <section
      id="dokumentasi"
      className="section-shell py-24 px-6 border-t border-[#2C3B2E]/10"
    >
      <div className="relative max-w-4xl mx-auto">
        <div className="max-w-2xl mb-14">
          <p className="label-eyebrow mb-3">Dokumentasi Kegiatan</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold mb-4 leading-tight">
            Cerita dari Lapangan
          </h2>
          <p className="text-[#4A5D45] leading-relaxed text-base md:text-lg">
            Catatan perjalanan kegiatan kelompok, diperbarui berkala oleh tim.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-[#2C3B2E]/10 bg-white p-6 text-sm text-[#4A5D45]">
            Memuat dokumentasi...
          </div>
        ) : activities.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#2C3B2E]/20 bg-white/60 p-6 text-sm text-[#4A5D45]">
            Dokumentasi kegiatan belum ditambahkan.
          </div>
        ) : (
          <div className="space-y-8">
            {activities.map((activity, index) => (
              <div key={activity.id} className="flex gap-6 items-start">
                <div className="flex flex-col items-center pt-1 self-stretch">
                  <div className="w-3 h-3 rounded-full bg-[#C08A2E]"></div>
                  {index < activities.length - 1 && (
                    <div className="w-px flex-1 bg-[#2C3B2E]/15 mt-2"></div>
                  )}
                </div>
                <div className="content-card rounded-2xl p-6 flex-1 card-hover">
                  {activity.image_url ? (
                    <img
                      src={activity.image_url}
                      alt={activity.title}
                      className="mb-5 aspect-video w-full rounded-xl object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                  <p className="text-xs uppercase tracking-[0.16em] text-[#C08A2E] font-semibold mb-3">
                    {formatDate(activity.activity_date)}
                  </p>
                  <h3 className="font-display text-2xl font-semibold mb-3 leading-tight">
                    {activity.title}
                  </h3>
                  <p className="text-sm text-[#4A5D45] leading-relaxed">
                    {activity.description || "Belum ada deskripsi."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
