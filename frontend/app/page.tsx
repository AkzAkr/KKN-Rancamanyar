import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Profil from "@/components/Profil";
import ProgramKerja from "@/components/ProgramKerja";
import Mading from "@/components/Mading";
import Dokumentasi from "@/components/Dokumentasi";
import Galeri from "@/components/Galeri";
import Kontak from "@/components/Kontak";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Profil />
      <ProgramKerja />
      <Mading />
      <Dokumentasi />
      <Galeri />
      <Kontak />
      <Footer />
    </>
  );
}
