import Footer from "@/components/utils/Footer";
import Hero from "@/components/utils/Hero";
import Navbar from "@/components/utils/Navbar";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
}
