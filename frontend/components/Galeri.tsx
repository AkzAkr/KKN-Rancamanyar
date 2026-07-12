"use client";

import { useEffect, useState } from "react";
import type { GalleryRecord } from "@/lib/content-types";
import { getSupabaseClient } from "@/lib/supabase/client";

export default function Galeri() {
  const [gallery, setGallery] = useState<GalleryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      setLoading(false);
      return;
    }

    const loadGallery = async () => {
      const { data } = await supabase
        .from("gallery")
        .select("id, title, image_url, created_at")
        .order("created_at", { ascending: false });

      setGallery((data ?? []).filter((item) => Boolean(item.image_url)));
      setLoading(false);
    };

    void loadGallery();
  }, []);

  return (
    <section
      id="galeri"
      className="py-24 px-6 bg-[#EFE9DB]/50 border-t border-[#2C3B2E]/10"
    >
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mb-14">
          <p className="label-eyebrow mb-3">Galeri</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
            Momen Kegiatan
          </h2>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-[#2C3B2E]/10 bg-white p-7 text-sm text-[#4A5D45]">
            Memuat galeri...
          </div>
        ) : gallery.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#2C3B2E]/20 bg-white/60 p-7 text-sm text-[#4A5D45]">
            Foto kegiatan belum ditambahkan.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((item) => (
              <figure
                key={item.id}
                className="group overflow-hidden rounded-xl bg-white border border-[#2C3B2E]/10"
              >
                <img
                  src={item.image_url ?? ""}
                  alt={item.title || "Dokumentasi kegiatan KKN Rancamanyar"}
                  className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                {item.title ? (
                  <figcaption className="px-3 py-2 text-xs font-medium text-[#4A5D45]">
                    {item.title}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
