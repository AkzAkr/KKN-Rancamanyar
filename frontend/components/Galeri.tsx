export default function Galeri() {
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-xl bg-white border border-[#2C3B2E]/10"
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
}
