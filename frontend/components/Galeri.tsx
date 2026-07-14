"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { GalleryRecord } from "@/lib/content-types";
import { getSupabaseClient } from "@/lib/supabase/client";

// Rotasi & offset acak untuk efek berserakan natural
const ROTATIONS = [-3, 2.5, -2, 3.5, -1.5, 2, -3.5, 1.5, -2.5, 3, -1, 2.5];
const OFFSETS_Y = [0, 10, -5, 8, -8, 5, -10, 3, 6, -6, 4, -4];
const TAPE_POSITIONS: Array<"top-left" | "top-right" | "top-center"> = [
  "top-left",
  "top-right",
  "top-center",
];

export default function Galeri() {
  const [gallery, setGallery] = useState<GalleryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

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

  const scrollSlider = useCallback((direction: "left" | "right") => {
    const track = trackRef.current;
    if (!track) return;
    const scrollAmount = 270;
    track.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }, []);

  const openLightbox = useCallback((index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  }, []);

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % gallery.length);
  }, [gallery.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  }, [gallery.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, closeLightbox, nextImage, prevImage]);

  const currentItem = gallery[currentIndex];

  const getTapeStyle = (pos: string) => {
    const base =
      "absolute w-[52px] h-5 bg-white/82 shadow-sm z-[5] border border-white/50 backdrop-blur-sm";
    if (pos === "top-left") return `${base} -top-2.5 left-3.5 -rotate-[10deg]`;
    if (pos === "top-right") return `${base} -top-2.5 right-3.5 rotate-[10deg]`;
    return `${base} -top-2.5 left-1/2 -translate-x-1/2 -rotate-[3deg]`;
  };

  return (
    <section
      id="galeri"
      className="section-shell py-24 px-6 bg-[#F7F4ED] border-t border-[#2C3B2E]/10"
    >
      <div className="relative max-w-6xl mx-auto">
        {/* Mading Board Panel */}
        <div
          className="relative rounded-3xl p-8 md:p-12 overflow-hidden"
          style={{
            background: "#EDE8DA",
            boxShadow:
              "inset 0 2px 20px rgba(44,59,46,0.06), 0 8px 32px rgba(44,59,46,0.08)",
          }}
        >
          {/* Cork texture noise overlay */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")`,
              backgroundSize: "200px 200px",
            }}
          />

          {/* Inner shadow border */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              boxShadow:
                "inset 0 0 0 1px rgba(44,59,46,0.06), inset 0 0 60px rgba(44,59,46,0.04)",
            }}
          />

          {/* Header */}
          <div className="relative mb-10 text-center">
            <p className="label-eyebrow mb-3">Galeri</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mb-4 leading-tight">
              Momen Kegiatan
            </h2>
          </div>

          {loading ? (
            <div className="relative rounded-2xl border border-[#2C3B2E]/10 bg-white/80 p-7 text-sm text-[#4A5D45] text-center backdrop-blur-sm">
              Memuat galeri...
            </div>
          ) : gallery.length === 0 ? (
            <div className="relative rounded-2xl border border-dashed border-[#2C3B2E]/20 bg-white/60 p-7 text-sm text-[#4A5D45] text-center">
              Foto kegiatan belum ditambahkan.
            </div>
          ) : (
            <>
              {/* Horizontal Slider */}
              <div className="relative px-12 md:px-16">
                {/* Prev Button */}
                <button
                  onClick={() => scrollSlider("left")}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 bg-white/85 text-[#2C3B2E] shadow-md border border-[#2C3B2E]/8 backdrop-blur-sm"
                  aria-label="Sebelumnya"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>

                {/* Track */}
                <div
                  ref={trackRef}
                  className="flex gap-8 overflow-x-auto pb-10 pt-6 px-4 scroll-smooth snap-x snap-mandatory hide-scrollbar"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {gallery.map((item, index) => {
                    const rot = ROTATIONS[index % ROTATIONS.length];
                    const offY = OFFSETS_Y[index % OFFSETS_Y.length];
                    const tapePos =
                      TAPE_POSITIONS[index % TAPE_POSITIONS.length];

                    return (
                      <figure
                        key={item.id}
                        onClick={() => openLightbox(index)}
                        className="shrink-0 cursor-pointer snap-start"
                        style={{
                          background: "#FFFFFF",
                          padding: "14px 14px 48px 14px",
                          borderRadius: "3px",
                          boxShadow:
                            "0 8px 24px rgba(44,59,46,0.12), 0 2px 8px rgba(44,59,46,0.08), 0 0 0 1px rgba(44,59,46,0.04)",
                          transform: `rotate(${rot}deg) translateY(${offY}px)`,
                          width: "240px",
                          position: "relative",
                          transition:
                            "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                          marginBottom: "12px",
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget;
                          el.style.transform =
                            "rotate(0deg) translateY(-12px) scale(1.04)";
                          el.style.boxShadow =
                            "0 24px 48px rgba(44,59,46,0.2), 0 8px 20px rgba(44,59,46,0.12), 0 0 0 1px rgba(44,59,46,0.06)";
                          el.style.zIndex = "10";
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget;
                          el.style.transform = `rotate(${rot}deg) translateY(${offY}px)`;
                          el.style.boxShadow =
                            "0 8px 24px rgba(44,59,46,0.12), 0 2px 8px rgba(44,59,46,0.08), 0 0 0 1px rgba(44,59,46,0.04)";
                          el.style.zIndex = "1";
                        }}
                      >
                        {/* Tape */}
                        <div className={getTapeStyle(tapePos)} />

                        {/* Photo */}
                        <div
                          className="overflow-hidden bg-[#EFE9DB] relative"
                          style={{
                            width: "212px",
                            height: "212px",
                            borderRadius: "2px",
                          }}
                        >
                          <img
                            src={item.image_url ?? ""}
                            alt={item.title || "Dokumentasi kegiatan"}
                            className="w-full h-full object-cover block"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>

                        {/* Caption */}
                        <figcaption
                          className="absolute bottom-3.5 left-3.5 right-3.5 text-center"
                          style={{
                            fontFamily: "Georgia, 'Times New Roman', serif",
                            fontSize: "13px",
                            color: "#2C3B2E",
                            fontWeight: 500,
                            lineHeight: 1.4,
                          }}
                        >
                          {item.title || "Tanpa Judul"}
                        </figcaption>
                      </figure>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => scrollSlider("right")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 bg-white/85 text-[#2C3B2E] shadow-md border border-[#2C3B2E]/8 backdrop-blur-sm"
                  aria-label="Berikutnya"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            </>
          )}

          {/* Bottom shadow fade */}
          <div
            className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(237,232,218,0.6), transparent)",
            }}
          />
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && currentItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(44, 59, 46, 0.9)",
            backdropFilter: "blur(12px)",
          }}
          onClick={closeLightbox}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: "rgba(255,255,255,0.12)",
              color: "#F7F4ED",
            }}
            aria-label="Tutup"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <div
            className="relative max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentItem.image_url ?? ""}
              alt={currentItem.title || "Dokumentasi"}
              className="w-full rounded-2xl shadow-2xl"
              style={{
                maxHeight: "70vh",
                objectFit: "contain",
                background: "#2C3B2E",
              }}
            />
            <p
              className="mt-4 text-center text-sm font-medium"
              style={{ color: "#F7F4ED" }}
            >
              {currentItem.title || "Tanpa Judul"} · {currentIndex + 1} /{" "}
              {gallery.length}
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: "rgba(255,255,255,0.12)",
              color: "#F7F4ED",
            }}
            aria-label="Sebelumnya"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: "rgba(255,255,255,0.12)",
              color: "#F7F4ED",
            }}
            aria-label="Berikutnya"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      )}

      {/* Hide scrollbar utility */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
