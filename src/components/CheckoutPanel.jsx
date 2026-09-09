"use client";

import { X, Sparkles } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { crearCita } from "@/services/functionServices";
import Image from "next/image";

export default function CheckoutPanel({
  carrito,
  total,
  onClose,
  onCitaCreada,
}) {
  const router = useRouter();
  const itemsServicio = Array.isArray(carrito) ? carrito : [];
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [clienteNombre, setClienteNombre] = useState("");
  const [yapeOperacion, setYapeOperacion] = useState("");
  const [cargando, setCargando] = useState(false);

  // Estados de Error
  const [nombreError, setNombreError] = useState("");
  const [fechaError, setFechaError] = useState("");
  const [horaError, setHoraError] = useState("");
  const [yapeError, setYapeError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

 

  const confirmarCita = async () => {
    setNombreError("");
    setFechaError("");
    setHoraError("");
    setYapeError("");
    setMensajeExito("");

    const nombreLimpio = clienteNombre.trim();
    const operacionLimpia = yapeOperacion.trim();
    const totalServicio = Number(total);

    let hayError = false;

    if (!nombreLimpio) {
      setNombreError("Ingresa tu nombre para agendar la cita.");
      hayError = true;
    }

    if (!fecha) {
      setFechaError("Selecciona una fecha.");
      hayError = true;
    }

    if (!hora) {
      setHoraError("Selecciona una hora.");
      hayError = true;
    }

    if (!operacionLimpia) {
      setYapeError("Ingresa el ID de operación de Yape.");
      hayError = true;
    }
    if (hayError) return;
    if (itemsServicio.length === 0) return;
    if (!totalServicio || totalServicio <= 0) return;

    try {
      setCargando(true);

      const data = {
        cliente_nombre: nombreLimpio,
        fecha_cita: fecha,
        hora_cita: hora,
        servicio: itemsServicio.map((item) => ({
          id: item.id,
          nombre: item.nombre,
          precio: Number(item.precio),
          cantidad: Number(item.cantidad || 1),
        })),
        total: totalServicio, 
        yape_operacion: operacionLimpia,
      };

      const respuesta = await crearCita(data);

      
      const idRegistrado = respuesta?.id || respuesta?.citaId || respuesta?.servicioId;

      if (!idRegistrado) {
        throw new Error("No se recibió el número de confirmación para su cita.");
      }

      setMensajeExito("Cita registrada correctamente. Redirigiendo...");

      localStorage.removeItem("carrito");
      if (onCitaCreada) onCitaCreada();

      router.push(`/servicio/${idRegistrado}`);
    } catch (error) {
      console.error("Error al agregar la cita:", error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 bg-black/50 px-4 py-6 backdrop-blur-sm">
      <div className="mx-auto flex max-h-[90vh] max-w-xl flex-col overflow-hidden rounded-3xl bg-nails-brown/40 shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-nails-brown px-6 py-5">
          <h2 className="text-2xl text-center font-title font-bold text-nails-yellow">
            CONFIRMAR CITA
          </h2>
          <button
            onClick={onClose}
            className="rounded-full bg-nails-caramelo p-2 text-nails-white hover:bg-nails-gold hover:text-nails-white transition"
          >
            <X size={22} />
          </button>
        </div>
        
        <span className="mt-2 text-s text-center font-black text-nails-white">
          ¡Al confirmar el pago, tu cita quedará registrada!
        </span>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="mt-6 overflow-hidden rounded-3xl p-6 shadow-lg">
            <div className="flex flex-col items-center gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="text-center lg:text-left">
                <p className="mt-4 text-xl font-title text-nails-yellow">
                  Escanea el QR
                </p>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-nails-white">
                  Realiza el pago desde tu aplicación Yape o Plin y coloca el ID de operación.
                </p>
                <div className="mt-5">
                  <p className="text-xl font-title uppercase tracking-wider text-nails-yellow">
                    Número
                  </p>
                  <p className="mt-1 text-2xl font-black text-nails-white">
                    929 943 978
                  </p>
                </div>
              </div>

              <div className="relative flex h-56 w-56 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-nails-gold p-2 shadow-2xl ring-1 ring-nails-gold">
                <Image
                  src="/branding/yape-qr.webp"
                  alt="QR de Yape"
                  fill
                  sizes="224px"
                  className="object-contain p-4"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Lista de Servicios  */}
          <div className="mt-6 max-h-56 space-y-3 overflow-y-auto rounded-2xl p-3">
            {itemsServicio.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center rounded-2xl px-4 py-3 text-lg font-bold"
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={24} className="text-nails-yellow" />
                  <span className="text-nails-white">{item.nombre}</span>
                </div>

                <span className="text-nails-white">
                  S/ {montoReserva}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <label className="text-l font-title text-nails-yellow">
              Nombre del cliente <span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              value={clienteNombre}
              onChange={(e) => {
                setClienteNombre(e.target.value);
                if (nombreError) setNombreError("");
              }}
              placeholder="Ejemplo: María López"
              className="mt-2 w-full rounded-2xl border border-nails-white px-4 py-3 outline-none nails-input"
            />
            {nombreError && (
              <div className="mt-2 text-sm font-bold text-red-700">
                {nombreError}
              </div>
            )}
          </div>

          {/* Fecha y Hora */}
          <div className="mt-5 flex flex-col gap-4">
            <label className="text-lg font-title text-nails-yellow font-bold">
              ¿Para cuándo desea agendar su cita? <span className="text-red-700">*</span>
            </label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-nails-yellow  tracking-wider">
                  Fecha de Reserva
                </label>
                <input
                  type="date"
                  value={fecha}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-nails-yellow  tracking-wider">
                  Hora Preferida
                </label>
                <input
                  type="time"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* ID Yape */}
          <div className="mt-5">
            <label className="text-l font-title text-nails-yellow">
              ID de operación Yape <span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              value={yapeOperacion}
              onChange={(e) => {
                setYapeOperacion(e.target.value);
                if (yapeError) setYapeError("");
              }}
              placeholder="Ejemplo: 84592136"
              className="mt-2 w-full rounded-2xl bg-nails-white border border-nails-gold px-4 py-3 outline-none focus:border-nails-caramelo"
            />
            {yapeError && (
              <div className="mt-2 text-xs font-bold text-red-700">
                {yapeError}
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 border-t bg-nails-brown px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xl font-black text-nails-yellow">
              Monto Restante: S/{ ( Number(total).toFixed(2))} - {montoReserva}
            </p>

            <button
              onClick={confirmarCita}
              disabled={cargando}
              className="nails-button-remove"
            >
              {cargando ? "Enviando..." : "Confirmar"}
            </button>
          </div>

          {mensajeExito && (
            <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
              {mensajeExito}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}