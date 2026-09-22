"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { obtenerCita } from "@/services/functionServices";
import { CalendarCheck, CheckCircle2, Clock, CreditCard, Phone, Sparkles, User, } from "lucide-react";

/* ============================================================
   HELPERS
============================================================ */

function normalizarBooleano(valor) {
  return (
    valor === true ||
    valor === 1 ||
    valor === "1"
  );
}

function obtenerServicios(servicio) {
  try {
    return typeof servicio === "string"
      ? JSON.parse(servicio)
      : servicio || [];
  } catch {
    return [];
  }
}

function formatearMetodoPago(metodo) {
  const metodos = {
    yape: "Yape",
    plin: "Plin",
    transferencia: "Transferencia bancaria",
  };

  return metodos[metodo] || metodo || "No indicado";
}

const formatearFecha = (fecha) => {
  if (!fecha) return "";

  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "America/Lima",
  }).format(new Date(fecha));
};

/* ============================================================
   PÁGINA DETALLE DE CITA
============================================================ */

export default function CitaDetallePage() {
  const params = useParams();
  const id = params?.id;

  const [cita, setCita] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  /* ==========================================================
     OBTENER CITA
  ========================================================== */

  useEffect(() => {
    if (!id) return;

    let activo = true;

    const cargarCita = async () => {
      try {
        const data = await obtenerCita(id);

        if (activo && data) {
          setCita(data);
          setError("");
        }
      } catch (error) {
        console.error(
          "Error al cargar la cita:",
          error
        );

        if (activo) {
          setError(
            error.message ||
              "No se pudo obtener la cita"
          );
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    cargarCita();

    /*
      Consultamos periódicamente para que el cliente
      pueda ver cuando el administrador confirme
      el pago de la reserva.
    */
    const intervalo = window.setInterval(
      cargarCita,
      5000
    );

    return () => {
      activo = false;

      window.clearInterval(
        intervalo
      );
    };
  }, [id]);

  /* ==========================================================
     CARGANDO
  ========================================================== */

  if (cargando) {
    return (
      <main className="min-h-screen bg-nails-champagne">
        <Navbar />

        <div className="flex justify-center px-4 py-12">
          <p className="animate-pulse font-black text-nails-brown">
            Cargando información de tu cita...
          </p>
        </div>
      </main>
    );
  }

  /* ==========================================================
     ERROR / CITA NO ENCONTRADA
  ========================================================== */

  if (error || !cita) {
    return (
      <main className="min-h-screen bg-nails-champagne">
        <Navbar />

        <div className="mx-auto max-w-xl px-4 py-12">
          <div className="rounded-3xl bg-white p-8 text-center shadow-xl">
            <p className="font-black text-red-600">
              {error ||
                "Cita no encontrada."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* ==========================================================
     DATOS NORMALIZADOS
  ========================================================== */

  const servicios = obtenerServicios( cita.servicio);
  const pagoVerificado = normalizarBooleano( cita.pago_verificado );
  const estado = cita.estado?.toLowerCase() || "pendiente";
  const citaAtendida =estado === "atendida";
  const citaCancelada = estado === "cancelada";
  const total = Number(cita.total || 0);
  const montoReserva = Number( cita.monto_reserva || 0 );
  const montoRestante = Number( cita.monto_restante || 0 );

  /* ==========================================================
     CITA ATENDIDA
  ========================================================== */

  if (citaAtendida) {
    return (
      <main className="min-h-screen bg-nails-champagne">
        <Navbar />

        <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
          <div className="rounded-3xl bg-green-700 p-8 text-white shadow-xl">
            <div className="flex flex-col items-center justify-center text-center">
              <CheckCircle2
                size={96}
                className="mb-5"
              />

              <p className="text-xs font-black uppercase tracking-widest text-green-100">
                Cita atendida
              </p>

              <h1 className="mt-2 text-2xl font-black sm:text-3xl">
                ¡Gracias por visitarnos!
              </h1>

              <p className="mt-3 max-w-md text-sm font-medium text-green-50">
                Esperamos que hayas disfrutado tu experiencia en Nails Vibe.
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  /* ==========================================================
     CITA CANCELADA
  ========================================================== */

  if (citaCancelada) {
    return (
      <main className="min-h-screen bg-nails-champagne">
        <Navbar />

        <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
          <div className="rounded-3xl bg-white p-8 text-center shadow-xl">
            <CalendarCheck
              size={72}
              className="mx-auto text-nails-brown"
            />

            <p className="mt-4 text-xs font-black uppercase tracking-widest text-nails-brown">
              Estado de la cita
            </p>

            <h1 className="mt-2 text-2xl font-black text-gray-900">
              Cita cancelada
            </h1>

            <p className="mt-3 text-sm text-gray-600">
              Esta cita ya no se encuentra activa.
            </p>
          </div>
        </section>
      </main>
    );
  }

  /* ==========================================================
     CITA ACTIVA
  ========================================================== */

  return (
    <main className="min-h-screen bg-nails-champagne">
      <Navbar />

      <section className="mx-auto w-full max-w-3xl px-3 py-6 sm:px-6 sm:py-10">
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl">

          {/* ==================================================
              CABECERA
          ================================================== */}

             <div className={`px-5 py-7 text-center text-white sm:px-8 ${pagoVerificado ?
             "bg-nails-gold"
             : "bg-nails-brown"
              }`}
              >
             <CalendarCheck
               size={56}
               className="mx-auto mb-3"
               />

              {pagoVerificado? (
              <>
               <p className="text-xs font-black uppercase tracking-widest opacity-80">
                 Reserva registrada
               </p>

               <h1 className="mt-2 text-xl font-black sm:text-2xl">
                Tu cita ha sido registrada correctamente!
               </h1>

               <p className="mt-2 text-sm font-semibold opacity-90">
                 Cita #{cita.id}
               </p>
               </>
             ) : (
               <>
              <p className="text-xs font-black text=red uppercase tracking-widest opacity-80">
                Pago pendiente
              </p>

              

               <p className="mt-2 text-sm font-semibold opacity-90">
                La reserva será confirmada cuando validemos el pago
               </p>
               </>
              )}
            </div>

           <div className="space-y-6 p-4 sm:p-6 md:p-8">
            {/* ==================================================
                ESTADO
            ================================================== */}

            <div
              className={`rounded-2xl border p-4 ${
                pagoVerificado
                  ? "border-green-200 bg-green-50"
                  : "border-amber-200 bg-amber-50"
              }`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase text-gray-500">
                    Estado de la reserva
                  </p>

                  <p
                    className={`mt-1 font-black ${
                      pagoVerificado
                        ? "text-green-700"
                        : "text-amber-700"
                    }`}
                  >
                    {pagoVerificado
                      ? "Pago confirmado"
                      : "Pago pendiente de verificación"}
                  </p>
                </div>

                {pagoVerificado ? (
                  <CheckCircle2
                    size={32}
                    className="text-green-700"
                  />
                ) : (
                  <Clock
                    size={32}
                    className="text-amber-700"
                  />
                )}
              </div>

              {!pagoVerificado ? (
                <p className="mt-3 text-xs font-medium text-gray-600">
                  Estamos verificando el pago de tu reserva. Esta página se actualizará automáticamente.
                </p>
              ) : null}
            </div>

            {/* ==================================================
                CLIENTE
            ================================================== */}

            <div>
              <p className="text-xs font-black uppercase tracking-wide text-nails-brown">
                Datos de la cliente
              </p>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
                  <User
                    size={20}
                    className="shrink-0 text-nails-brown"
                  />

                  <div>
                    <p className="text-xs text-gray-500">
                      Nombre
                    </p>

                    <p className="font-black text-gray-900">
                      {cita.cliente_nombre || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
                  <Phone
                    size={20}
                    className="shrink-0 text-nails-brown"
                  />

                  <div>
                    <p className="text-xs text-gray-500">
                      Teléfono
                    </p>

                    <p className="font-black text-gray-900">
                      {cita.cliente_telefono || "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================================================
                FECHA Y HORA
            ================================================== */}

            <div>
              <p className="text-xs font-black uppercase tracking-wide text-nails-brown">
                Fecha de tu cita
              </p>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
                  <CalendarCheck
                    size={20}
                    className="text-nails-brown"
                  />

                  <div>
                    <p className="text-xs text-gray-500">
                      Fecha
                    </p>

                    <p className="font-black text-gray-900">
                      {formatearFecha(cita.fecha_cita) ||
                        "Por confirmar"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
                  <Clock
                    size={20}
                    className="text-nails-brown"
                  />

                  <div>
                    <p className="text-xs text-gray-500">
                      Hora
                    </p>

                    <p className="font-black text-gray-900">
                      {cita.hora_cita ||
                        "Por confirmar"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================================================
                SERVICIOS
            ================================================== */}

            <div>
              <p className="text-xs font-black uppercase tracking-wide text-nails-brown">
                Servicios reservados
              </p>

              <ul className="mt-3 space-y-2">
                {servicios.map(
                  (servicio, index) => (
                    <li
                      key={
                        servicio.id ||
                        index
                      }
                      className="flex items-start justify-between gap-4 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3"
                    >
                      <div className="flex items-start gap-2">
                        <Sparkles
                          size={16}
                          className="mt-0.5 shrink-0 text-nails-brown"
                        />

                        <div>
                          <p className="text-sm font-black text-gray-900">
                            {servicio.nombre}
                          </p>

                          {servicio.duracionMinutos ? (
                            <p className="mt-1 text-xs font-medium text-gray-500">
                              {
                                servicio.duracionMinutos
                              }{" "}
                              min
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <span className="whitespace-nowrap text-sm font-black text-gray-900">
                        S/{" "}
                        {Number(
                          servicio.precio ||
                            0
                        ).toFixed(2)}
                      </span>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* ==================================================
                PAGO
            ================================================== */}

            <div>
              <p className="text-xs font-black uppercase tracking-wide text-nails-brown">
                Información del pago
              </p>

              <div className="mt-3 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-2">
                  <CreditCard
                    size={18}
                    className="text-nails-brown"
                  />

                  <span className="text-sm font-black text-gray-900">
                    {formatearMetodoPago(
                      cita.metodo_pago
                    )}
                  </span>
                </div>

                <div className="mt-4 space-y-2 border-t border-gray-200 pt-4">
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="font-semibold text-gray-600">
                      Total del servicio
                    </span>

                    <span className="font-black text-gray-900">
                      S/ {total.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 text-sm">
                    <span className="font-semibold text-gray-600">
                      Reserva
                    </span>

                    <span className="font-black text-nails-brown">
                      S/{" "}
                      {montoReserva.toFixed(
                        2
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 text-sm">
                    <span className="font-semibold text-gray-600">
                      Saldo pendiente
                    </span>

                    <span className="font-black text-gray-900">
                      S/{" "}
                      {montoRestante.toFixed(
                        2
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================================================
                AVISO
            ================================================== */}

            <div className="rounded-2xl bg-nails-brown/10 p-4 text-center">
              <p className="text-xs font-semibold leading-relaxed text-nails-brown">
                Conserva esta página para  consultar el estado de tu reserva.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}