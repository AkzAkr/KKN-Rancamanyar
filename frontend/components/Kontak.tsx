export default function Kontak() {
  return (
    <section id="kontak" className="py-24 px-6 border-t border-[#2C3B2E]/10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-start">
        <div>
          <p className="label-eyebrow mb-3">Lokasi & Kontak</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
            Temui Kami
          </h2>
          <p className="text-[#4A5D45] leading-relaxed mb-8">
            Kelompok KKN Rancamanyar berlokasi di Desa Rancamanyar. Silakan
            hubungi kami untuk informasi lebih lanjut mengenai program kerja
            atau kunjungan.
          </p>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#EFE9DB] flex items-center justify-center text-[#C08A2E]">
                @
              </span>
              <span>instagram.com/kkn.rancamanyar</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#EFE9DB] flex items-center justify-center text-[#C08A2E]">
                ✉
              </span>
              <span>kkn.rancamanyar@email.com</span>
            </div>
          </div>
        </div>
        <div className="aspect-video rounded-2xl bg-[#EFE9DB] border border-[#2C3B2E]/10 flex items-center justify-center text-sm text-[#4A5D45]">
          Peta lokasi Desa Rancamanyar
        </div>
      </div>
    </section>
  );
}
