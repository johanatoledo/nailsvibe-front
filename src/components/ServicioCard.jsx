import Image from "next/image";
import { ArrowLeft, Clock, Check } from "lucide-react";

const PORCENTAJE_RESERVA = 0.2;

export default function ServicioCard({
  servicio,
  cantidad = 0,
  onAgregar,
  onEliminar,
}) {
  if (!servicio) return null;

  const estaSeleccionado = cantidad > 0;

  const precio = Number(servicio.precio) || 0;
  const reserva = precio * PORCENTAJE_RESERVA;

  return (
    <article className="group nails-product-card nails-fade-in  flex h-full w-[82vw] max-w-[320px] shrink-0 snap-start flex-col overflow-hidden sm:w-full sm:max-w-none sm:shrink ">
      
      {/* Imagen */}
      <div className="relative h-60 w-full overflow-hidden">
        <Image
          src={servicio.imagen}
          alt={servicio.nombre}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="
            (max-width: 639px) 78vw,
            (max-width: 1023px) 50vw,
            (max-width: 1279px) 33vw,
            25vw
          "
        />

        <div className="absolute inset-0 bg-lineal-to-t from-black/25 via-transparent to-transparent" />

        {estaSeleccionado && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-bold text-green-700 shadow">
            <Check size={13} />
            Seleccionado
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-4">
        
        {/* Título */}
        <h3 className="nails-title text-xl font-bold text-nails-brown">
          {servicio.nombre}
        </h3>

        {/* Duración */}
        {servicio.duracionMinutos && (
          <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
            <Clock size={15} />
            <span>
              {servicio.duracionMinutos} min
            </span>
          </div>
        )}

        {/* Descripción */}
        <div className="mt-4">
          <p className="text-xs font-bold tracking-wide text-gray-800">
            INCLUYE
          </p>

          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600">
            {servicio.descripcion}
          </p>
        </div>

        {/* Precio */}
        <div className="mt-auto pt-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500">
                Precio del servicio
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

          {/* Acción */}
          <div className="mt-5">
            {estaSeleccionado ? (
              <button
                type="button"
                onClick={() => onEliminar?.(servicio.id)}
                className="nails-button-remove flex w-full items-center justify-center gap-2"
              >
                <ArrowLeft size={15} />
                Cambiar servicio
              </button>
            ) : (
             <div className="flex justify-end">
              <button
               type="button"
               onClick={() => onAgregar?.(servicio)}
               className="nails-button-add flex w-fit items-center justify-center px-5 py-2 text-sm hover:bg-nails-caramelo"
               >
              Agregar Servicio
             </button>
          </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}