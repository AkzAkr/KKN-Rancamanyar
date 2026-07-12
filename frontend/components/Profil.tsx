const PENGURUS = [
  { no: "01", role: "Ketua", name: "Fadli Kamil" },
  { no: "02", role: "Sekretaris", name: "Cipa, Vera" },
  { no: "03", role: "Bendahara", name: "Risa" },
];

const DIVISI = [
  { title: "Divisi Acara", members: ["Salman", "Putri", "Abdul Jafar"] },
  { title: "Divisi PDD", members: ["Rido", "Ihsan", "M. Hilmi"] },
  { title: "Divisi Logistik", members: ["Rifki", "Gagan", "Anang"] },
  { title: "Divisi Konsumsi", members: ["Siti Anisa", "Khodijah"] },
  { title: "Divisi Humas", members: ["Gio", "Nazala"] },
];

const ANGGOTA = [
  "Fadli Kamil",
  "Cipa",
  "Vera",
  "Risa",
  "Salman",
  "Putri",
  "Abdul Jafar",
  "Rido",
  "Ihsan",
  "M. Hilmi",
  "Rifki",
  "Gagan",
  "Anang",
  "Siti Anisa",
  "Khodijah",
  "Gio",
  "Nazala",
];

export default function Profil() {
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

        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {PENGURUS.map((p) => (
            <div
              key={p.no}
              className="bg-white rounded-2xl p-6 border border-[#2C3B2E]/10 card-hover"
            >
              <div className="w-11 h-11 rounded-full bg-[#EFE9DB] flex items-center justify-center mb-4">
                <span className="font-display text-[#C08A2E] font-semibold">
                  {p.no}
                </span>
              </div>
              <p className="text-xs text-[#4A5D45] mb-1">{p.role}</p>
              <p className="font-display font-semibold text-lg">{p.name}</p>
            </div>
          ))}
        </div>

        {/* divisi */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {DIVISI.map((d) => (
            <div
              key={d.title}
              className="bg-white rounded-2xl p-6 border border-[#2C3B2E]/10 card-hover"
            >
              <p className="label-eyebrow mb-3">{d.title}</p>
              <ul className="space-y-1.5 text-sm">
                {d.members.map((m) => (
                  <li key={m} className="font-medium">
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="bg-white rounded-2xl p-6 border border-[#2C3B2E]/10 card-hover flex flex-col justify-center items-center text-center">
            <p className="text-xs text-[#4A5D45] mb-1">Total Anggota</p>
            <p className="font-display text-3xl font-semibold text-[#2C3B2E]">
              17
            </p>
            <p className="text-xs text-[#4A5D45] mt-1">Mahasiswa</p>
          </div>
        </div>

        {/* seluruh anggota */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <p className="label-eyebrow">Seluruh Anggota</p>
            <p className="text-xs text-[#4A5D45]/60 hidden sm:block">
              Geser untuk melihat lainnya →
            </p>
          </div>
          <div className="relative">
            <div className="member-scroll flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 sm:mx-0 sm:px-0 scroll-smooth snap-x snap-mandatory">
              {ANGGOTA.map((name) => (
                <div
                  key={name}
                  className="member-card snap-start shrink-0 w-36 bg-white rounded-2xl p-4 border border-[#2C3B2E]/10 card-hover text-center"
                >
                  <div className="aspect-square rounded-xl bg-[#EFE9DB] mb-3"></div>
                  <p className="text-sm font-semibold">{name}</p>
                  <p className="text-xs text-[#4A5D45]">Prodi</p>
                </div>
              ))}
            </div>
            <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-[#F7F4ED] to-transparent sm:from-[#F7F4ED]"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
