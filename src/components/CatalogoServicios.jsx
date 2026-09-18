"use client";

import { useEffect, useMemo, useState } from "react";

import ServicioCard from "@/components/ServicioCard";
import CartBar from "@/components/CartBar";
import CheckoutPanel from "@/components/CheckoutPanel";

export default function CatalogoServicios({ servicios = [] }) {
  const [carrito, setCarrito] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [checkoutAbierto, setCheckoutAbierto] = useState(false);

  useEffect(() => {
    try {
      const carritoGuardado = localStorage.getItem("carrito");

      if (carritoGuardado) {
        setCarrito(JSON.parse(carritoGuardado));
      }
    } catch (error) {
      console.error("Error cargando el carrito:", error);
    }
  }, []);

  const categorias = useMemo(
    () => [
      "Todos",
      ...new Set(
        servicios.map((servicio) => servicio.categoria)
      ),
    ],
    [servicios]
  );

  const serviciosFiltrados = useMemo(() => {
    if (categoriaActiva === "Todos") {
      return servicios;
    }

    return servicios.filter(
      (servicio) =>
        servicio.categoria === categoriaActiva
    );
  }, [categoriaActiva, servicios]);

  const total = useMemo(
    () =>
      carrito.reduce(
        (acc, item) =>
          acc +
          Number(item.precio) *
            Number(item.cantidad || 1),
        0
      ),
    [carrito]
  );

  const guardarCarrito = (nuevoCarrito) => {
    setCarrito(nuevoCarrito);

    localStorage.setItem(
      "carrito",
      JSON.stringify(nuevoCarrito)
    );
  };

  const agregarServicio = (servicio) => {
    const existe = carrito.find(
      (item) => item.id === servicio.id
    );

    const nuevoCarrito = existe
      ? carrito.map((item) =>
          item.id === servicio.id
            ? {
                ...item,
                cantidad: (item.cantidad || 1) + 1,
              }
            : item
        )
      : [
          ...carrito,
          {
            ...servicio,
            cantidad: 1,
          },
        ];

    guardarCarrito(nuevoCarrito);
  };

  const eliminarServicio = (id) => {
    const nuevoCarrito = carrito.filter(
      (item) => item.id !== id
    );

    guardarCarrito(nuevoCarrito);
  };

  const limpiarCarrito = () => {
    setCarrito([]);
    localStorage.removeItem("carrito");
    setCheckoutAbierto(false);
  };

  const obtenerCantidad = (id) => {
    return (
      carrito.find((item) => item.id === id)
        ?.cantidad ?? 0
    );
  };

  return (
    <>
      {/* FILTROS */}
     <div className="mt-6 flex flex-wrap justify-center gap-2 px-2 sm:mt-8 sm:gap-3 sm:px-0">
      {categorias.map((categoria) => {
        const activa = categoriaActiva === categoria;

        return (
         <button
           key={categoria}
           type="button"
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

      {/* CONTENEDOR DE TARJETAS  */}
      <div className="  mt-10 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto  overscroll-x-contain px-4  pb-5 sm:mx-0  sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 xl:grid-cols-4 " >
        {serviciosFiltrados.map((servicio, index) => (
          <ServicioCard
            key={servicio.id}
            servicio={servicio}
            cantidad={obtenerCantidad( servicio.id )}
            onAgregar={agregarServicio}
            onEliminar={eliminarServicio}
            prioridad={index === 0}
          />
        ))}
      </div>

      {/* CARRITO */}
      <CartBar
        carrito={carrito}
        onOpenCheckout={() =>
          setCheckoutAbierto(true)
        }
      />

      {/* CHECKOUT */}
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
    </>
  );
}