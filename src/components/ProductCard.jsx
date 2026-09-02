import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";

export default function ProductCard({
  producto,
  cantidad = 0,
  onAgregar,
  onEliminar,
}) {
  const estaEnCarrito = cantidad > 0;

  return (
    <article className="group nails-product-card nails-fade-in">
  <div className="relative h-60 w-full overflow-hidden ">
    <Image
      src={producto.imagen}
      alt={producto.nombre}
      fill
      className="object-cover transition-transform duration-700 group-hover:scale-110"
      sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw,50vw"
    />

    <div className="nails-product-image-overlay" />
  </div>

  <div className="p-2">
    <h3 className="mt-4 nails-title text-xl">
      {producto.nombre}
    </h3>
   <span className="font-bold">INCLUYE:</span>
    <p className="mt-3 min-h-14 text-sm text-aline-justify leading-relaxed text-gray-600">
      {producto.descripcion}
    </p>

    <div className="mt-2 flex items-center justify-between gap-3">
      {/* Precio Total del Servicio */}
      <div className="flex items-center justify-between">
       <span className="text-xs font-bold">PRECIO TOTAL: 
        <p className="nails-product-price text-sm  opacity-80">
           S/ {Number(producto.precio).toFixed(2)}
          </p>
          </span>
        
      </div>

      {/* Monto de Reserva (20%) */}
      <div className="flex items-center justify-between font-semibold">
       <span className="text-xs text-nails-black">RESERVA (20%):
        <p className="text-base text-nails-brown font-bold">
          S/ {(Number(producto.precio) * 0.20).toFixed(2)}
       </p>
       </span>
       
  </div>

      {estaEnCarrito ? (
        <button
          onClick={() => onEliminar(producto.id)}
          className="nails-button-remove"
        >
          <Trash2 size={14} />
          Atras
        </button>
      ) : (
        <button
          onClick={() => onAgregar(producto)}
          className="nails-button-add"
        >
          
          Agendar
        </button>
      )}
    </div>

    {cantidad > 0 && (
      <p className="mt-4 text-sm font-black text-green-700">
        Agendada cita para: (Cantidad: {cantidad}){producto.nombre} 
      </p>
    )}
  </div>
</article>
  );
}