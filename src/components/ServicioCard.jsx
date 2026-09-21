"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, Clock, Check, X, } from "lucide-react";

const PORCENTAJE_RESERVA = 0.2;

export default function ServicioCard({
  servicio,
  cantidad = 0,
  onAgregar,
  onEliminar,
  prioridad = false,
}) {
  const [detalleAbierto, setDetalleAbierto] =
    useState(false);

  if (!servicio) return null;

  const estaSeleccionado = cantidad > 0;

  const precio = Number(servicio.precio) || 0;
  const reserva = precio * PORCENTAJE_RESERVA;

  const toggleDetalle = () => {
    setDetalleAbierto((prev) => !prev);
  };

  const cerrarDetalle = (event) => {
    event.stopPropagation();
    setDetalleAbierto(false);
  };

  return (
    <article
      className=" group nails-product-card nails-fade-in flex h-130 w-[82vw] max-w-[320px] shrink-0 snap-start flex-col overflow-hidden sm:w-full sm:max-w-none sm:shrink " >
      {/* Imagen + detalle */}
      <div
        className=" relative h-64 w-full shrink-0 cursor-pointer overflow-hidden "
        onClick={toggleDetalle}
        role="button"
        tabIndex={0}
        aria-expanded={detalleAbierto}
        aria-label={`Ver detalles de ${servicio.nombre}`}
        onKeyDown={(event) => {
          if ( event.key === "Enter" || event.key === " " ) {
            event.preventDefault();
            toggleDetalle();
          }
        }}
      >
        <Image
          src={servicio.imagen}
          alt={servicio.nombre}
          fill
          loading={prioridad ? "eager" : "lazy"}
          className=" object-cover transition-transform duration-500 group-hover:scale-105 "
          sizes=" (max-width: 639px) 82vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw "
        />

        {/* Degradado normal */}
        <div className=" absolute inset-0 bg-linear-to-t from-nails-caramelo/20 via-transparent to-transparent " />

        {/* Overlay descripción */}
        <div className={` absolute inset-0 z-10 flex flex-col justify-end bg-nails-caramelo/20 p-5 backdrop-blur-[2px] transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100
            ${
              detalleAbierto
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0"
            }
          `}
        >
          {/* Cerrar en móvil */}
          <button
            type="button"
            onClick={cerrarDetalle}
            className=" absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow md:hidden "
            aria-label="Cerrar detalles"
          >
            <X size={16} />
          </button>

          <p className="text-xs font-bold tracking-wider text-nails-white">
            INCLUYE
          </p>

          <p className="mt-2 text-sm leading-relaxed font-bold text-nails-white">
            {servicio.descripcion}
          </p>
        </div>

        {/* Seleccionado */}
        {estaSeleccionado && (
          <div className=" absolute right-3 top-3 z-20 flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-bold text-green-700 shadow " >
            <Check size={13} aria-hidden="true" />
            Seleccionado
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-4">
        {/* Título */}
        <h3 className=" nails-title min-h-10 line-clamp-2 text-xl font-bold  leading-7 text-nails-brown " >
          {servicio.nombre}
        </h3>

        {/* Duración */}
        <div className="mt-2 h-2">
          {servicio.duracionMinutos && (
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Clock
                size={15}
                aria-hidden="true"
              />

              <span>
                {servicio.duracionMinutos} min
              </span>
            </div>
          )}
        </div>

        {/* Precio + acción */}
        <div className="mt-auto pt-2">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500">
                Precio
              </p>

              <p className="mt-1 text-xl font-bold text-nails-brown">
                S/ {precio.toFixed(2)}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs font-medium text-gray-500">
                Reserva 20%
              </p>

              <p className="mt-1 text-base font-bold text-nails-brown">
                S/ {reserva.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Botón */}
          <div className="mt-5 flex min-h-5 justify-end">
            {estaSeleccionado ? (
              <button
                type="button"
                onClick={() =>
                  onEliminar?.(servicio.id)
                }
                className=" nails-button-remove flex w-full items-center justify-center gap-2 "
               >
                <ArrowLeft
                  size={15}
                  aria-hidden="true"
                />

                Cambiar servicio
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  onAgregar?.(servicio)
                }
                className=" nails-button-add flex w-fit items-center justify-center px-5  py-4 text-sm hover:bg-nails-caramelo "
              >
                Agregar Servicio
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}