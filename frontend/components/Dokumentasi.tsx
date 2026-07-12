const ENTRIES = [
  {
    date: "12 Juli 2026",
    title: "Pembukaan Pelatihan Digitalisasi UMKM",
    desc: "Sesi pertama diikuti 15 pelaku usaha, mulai dari pemilik warung hingga pengrajin anyaman. Fokus hari ini: pengenalan foto produk dan cara membuat akun media sosial usaha.",
    photos: true,
  },
  {
    date: "8 Juli 2026",
    title: "Pemetaan Potensi Desa Selesai",
    desc: "Tim menyelesaikan survei ke 4 dusun, mencatat sebaran usaha pertanian dan kerajinan yang akan menjadi dasar penyusunan program kerja berikutnya.",
    photos: false,
  },
];

export default function Dokumentasi() {
  return (
    <section
      id="dokumentasi"
      className="py-24 px-6 border-t border-[#2C3B2E]/10"
    >
      <div className="max-w-4xl mx-auto">
        <div className="max-w-xl mb-14">
          <p className="label-eyebrow mb-3">Dokumentasi Kegiatan</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
            Cerita dari Lapangan
          </h2>
          <p className="text-[#4A5D45] leading-relaxed">
            Catatan perjalanan kegiatan kelompok, diperbarui berkala oleh
            tim.
          </p>
        </div>

        <div className="space-y-8">
          {ENTRIES.map((entry, i) => (
            <div key={entry.title} className="flex gap-6 items-start">
              <div className="flex flex-col items-center pt-1">
                <div className="w-3 h-3 rounded-full bg-[#C08A2E]"></div>
                {i < ENTRIES.length - 1 && (
                  <div className="w-px flex-1 bg-[#2C3B2E]/15 mt-2"></div>
                )}
              </div>
              <div className="bg-white rounded-2xl p-6 border border-[#2C3B2E]/10 flex-1 card-hover">
                <p className="text-xs text-[#C08A2E] font-semibold mb-2">
                  {entry.date}
                </p>
                <h3 className="font-display text-lg font-semibold mb-2">
                  {entry.title}
                </h3>
                <p
                  className={`text-sm text-[#4A5D45] leading-relaxed ${entry.photos ? "mb-4" : ""}`}
                >
                  {entry.desc}
                </p>
                {entry.photos && (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="aspect-video rounded-lg bg-[#EFE9DB]"></div>
                    <div className="aspect-video rounded-lg bg-[#EFE9DB]"></div>
                    <div className="aspect-video rounded-lg bg-[#EFE9DB]"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
