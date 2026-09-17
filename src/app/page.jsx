import Navbar from "@/components/Navbar";
import CatalogoServicios from "@/components/CatalogoServicios";
import { servicios } from "@/data/servicios";

export default function HomeMenuPage() {
  return (
    <main className="min-h-screen bg-nails-champagne pb-40">
      <Navbar />

      <section className="mx-auto w-full max-w-10xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
       <div className="text-center">
         <h1 className="--font-title text-3xl font-bold text-nails-brown sm:text-4xl md:text-5xl lg:text-6xl">
           ¡Bienvenidos a Nails Vibe!
         </h1>
       </div>

        <CatalogoServicios servicios={servicios} />
      </section>
    </main>
  );
}