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
      ...new Set(servicios.map((servicio) => servicio.categoria)),
    ],
    [servicios]
  );

  const serviciosFiltrados = useMemo(() => {
    if (categoriaActiva === "Todos") {
      return servicios;
    }

    return servicios.filter(
      (servicio) => servicio.categoria === categoriaActiva
    );
  }, [categoriaActiva, servicios]);

  const total = useMemo(
    () =>
      carrito.reduce(
        (acc, item) =>
          acc + Number(item.precio) * item.cantidad,
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
                cantidad: item.cantidad + 1,
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
      carrito.find((item) => item.id === id)?.cantidad ?? 0
    );
  };

  return (
    <>
      {/* FILTROS DE CATEGORÍAS */}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {categorias.map((categoria) => {
          const activa =
            categoriaActiva === categoria;

          return (
            <button
              key={categoria}
              type="button"
              onClick={() =>
                setCategoriaActiva(categoria)
              }
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

      {/* GRID DE SERVICIOS */}
      <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {serviciosFiltrados.map((servicio) => (
          <ServicioCard
            key={servicio.id}
            servicio={servicio}
            cantidad={obtenerCantidad(servicio.id)}
            onAgregar={agregarServicio}
            onEliminar={eliminarServicio}
          />
        ))}
      </div>

      {/* AQUÍ VA CARTBAR */}
      <CartBar
        carrito={carrito}
        onOpenCheckout={() =>
          setCheckoutAbierto(true)
        }
      />

      {/* AQUÍ VA CHECKOUTPANEL */}
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