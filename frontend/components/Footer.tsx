export default function Footer() {
  return (
    <footer className="py-10 px-6 border-t border-[#2C3B2E]/10 bg-[#2C3B2E]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[#F7F4ED]/70 text-sm">
        <p>
          &copy; 2026 KKN Rancamanyar. Belajar &middot; Berkarya &middot;
          Mengabdi.
        </p>
        <a
          href="#"
          className="text-[#F7F4ED]/50 hover:text-[#F7F4ED] transition-colors"
        >
          Masuk Admin
        </a>
      </div>
    </footer>
  );
}
