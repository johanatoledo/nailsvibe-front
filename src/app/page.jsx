"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ServicioCard from "@/components/ServicioCard";
import CartBar from "@/components/CartBar";
import CheckoutPanel from "@/components/CheckoutPanel";
import { servicios } from "@/data/servicios";

export default function HomeMenuPage() {
  const [carrito, setCarrito] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [checkoutAbierto, setCheckoutAbierto] = useState(false);

  useEffect(() => {
    const carritoGuardado = localStorage.getItem("carrito");

    if (carritoGuardado) {
      setCarrito(JSON.parse(carritoGuardado));
    }
  }, []);

 

  const categorias = [
    "Todos",
    ...new Set(servicios.map((p) => p.categoria)),
  ];

  const serviciosFiltrados =
    categoriaActiva === "Todos"
      ? servicios
      : servicios.filter(
          (servicio) => servicio.categoria === categoriaActiva
        );

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

const agregarServicio = (servicio) => {
  setCarrito((prev) => {
    const existe = prev.find((item) => item.id === servicio.id);
    const nuevoCarrito = existe
      ? prev.map((item) =>
          item.id === servicio.id
            ? { ...item, cantidad: (item.cantidad || 1) + 1 }
            : item
        )
      : [...prev, { ...servicio, cantidad: 1 }];

    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    return nuevoCarrito;
  });
};

const eliminarServicio = (id) => {
  setCarrito((prev) => {
    const nuevoCarrito = prev.filter((item) => item.id !== id);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    return nuevoCarrito;
  });
};

  const limpiarCarrito = () => {
    setCarrito([]);
    setCheckoutAbierto(false);
  };

  const obtenerCantidad = (id) => {
    const item = carrito.find(
      (servicio) => servicio.id === id
    );

    return item ? item.cantidad : 0;
  };

  return (
    <main className="min-h-screen bg-nails-champagne pb-40">
      <Navbar />

      <section className="mx-auto w-full max-w-10xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="text-center">
            <h1 className="--font-title text-6xl text-nails-brown font-bold">
              ¡Bienvenidos a Nails Vibe!
            </h1>
        
        </div>

       <div className="mt-8 flex flex-wrap justify-center gap-3">
           {categorias.map((categoria) => {
            const activa = categoriaActiva === categoria;

             return (
              <button
               key={categoria}
               onClick={() => setCategoriaActiva(categoria)}
               className={`nails-category-button ${
               activa
               ? "nails-category-button-active"
               : "nails-category-button-inactive"
             }`}
          >
            {categoria}
         </button>
        );
      })}
     </div>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {serviciosFiltrados.map((servicio) => (
            < ServicioCard
              key={servicio.id}
              servicio={servicio}
              cantidad={obtenerCantidad(servicio.id)}
              onAgregar={agregarServicio}
              onEliminar={eliminarServicio}
            />
          ))}
        </div>
      </section>

      <CartBar
        carrito={carrito}
        onOpenCheckout={() =>
          setCheckoutAbierto(true)
        }
      />

      {checkoutAbierto && (
        <CheckoutPanel
          carrito={carrito}
          total={total}
          onClose={() =>
            setCheckoutAbierto(false)
          }
          onCitaCreada={limpiarCarrito}
        />
      )}
    </main>
  );
}