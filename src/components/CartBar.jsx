import { CalendarPlus } from "lucide-react";

export default function CartBar({ carrito, onOpenCheckout }) {
  const cantidadProductos = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  if (carrito.length === 0) return null;

  return (
    <div className="fixed bottom-5 left-1/2 z-50 w-[92%] max-w-2xl -translate-x-1/2 rounded-3xl bg-nails-white/80 p-5 shadow-2xl ring-1 ring-red-100">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="nails-icon-calendar">
            <CalendarPlus size={40} />
          </div>

          <div>
            <p className="text-sm font-bold text-nails-brown">
              {cantidadProductos} Servicio(s)
            </p>
            <p className="text-xl font-black text-gray-900">
              Total: S/ {total.toFixed(2)}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCheckout}
          className="nails-button-calendar"
        >
          Reservar Cita
        </button>
      </div>
    </div>
  );
}