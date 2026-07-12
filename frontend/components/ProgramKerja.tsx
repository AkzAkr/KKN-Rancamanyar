const PROGRAMS = [
  {
    status: "Berjalan",
    statusClass: "bg-[#4A5D45]/10 text-[#4A5D45]",
    title: "Pelatihan Digitalisasi UMKM",
    desc: "Membantu pelaku usaha kecil di desa membuat katalog produk digital dan akun media sosial untuk memperluas pasar di luar desa.",
  },
  {
    status: "Rencana",
    statusClass: "bg-[#C08A2E]/15 text-[#C08A2E]",
    title: "Bimbingan Belajar Anak Desa",
    desc: "Program belajar sore untuk siswa SD dan SMP, fokus pada literasi, numerasi dasar, dan pengenalan komputer sederhana.",
  },
  {
    status: "Selesai",
    statusClass: "bg-[#2C3B2E]/10 text-[#2C3B2E]",
    title: "Pemetaan Potensi Desa",
    desc: "Survei dan pendataan potensi pertanian, kerajinan, dan sumber daya desa sebagai dasar perencanaan program kerja selanjutnya.",
  },
];

export default function ProgramKerja() {
  return (
    <section
      id="program"
      className="py-24 px-6 bg-[#EFE9DB]/50 border-t border-[#2C3B2E]/10"
    >
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mb-14">
          <p className="label-eyebrow mb-3">Program Kerja</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
            Apa yang Kami Kerjakan
          </h2>
          <p className="text-[#4A5D45] leading-relaxed">
            Rangkaian program yang dirancang bersama warga, disesuaikan
            dengan kebutuhan Desa Rancamanyar.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PROGRAMS.map((p) => (
            <div
              key={p.title}
              className="bg-white rounded-2xl p-7 border border-[#2C3B2E]/10 card-hover"
            >
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${p.statusClass}`}
              >
                {p.status}
              </span>
              <h3 className="font-display text-xl font-semibold mb-2">
                {p.title}
              </h3>
              <p className="text-sm text-[#4A5D45] leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
