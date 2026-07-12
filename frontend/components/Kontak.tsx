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
            Kelompok 8 KKN Rancamanyar berlokasi di Desa Rancamanyar. Silakan
            hubungi kami untuk informasi lebih lanjut mengenai program kerja
            atau kunjungan.
          </p>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#EFE9DB] flex items-center justify-center text-[#C08A2E]">
                @
              </span>
              <span>instagram.com/kkn8rancamanyar</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#EFE9DB] flex items-center justify-center text-[#C08A2E]">
                ✉
              </span>
              <span>kkn.rancamanyar@email.com</span>
            </div>
          </div>
        </div>
        <div className="aspect-video overflow-hidden rounded-2xl bg-[#EFE9DB] border border-[#2C3B2E]/10">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31681.277598329627!2d107.57207335608038!3d-6.990463002666192!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e93f57604af1%3A0xa277ba293a3b53dd!2sRancamanyar%2C%20Kec.%20Baleendah%2C%20Kabupaten%20Bandung%2C%20Jawa%20Barat!5e0!3m2!1sid!2sid!4v1783895481406!5m2!1sid!2sid"
            title="Peta lokasi Desa Rancamanyar"
            width="1280"
            height="720"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="h-full w-full"
          />
        </div>
      </div>
    </section>
  );
}
