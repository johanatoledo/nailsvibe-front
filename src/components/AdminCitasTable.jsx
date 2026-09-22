"use client";

import { useState } from "react";
import { AlertCircle, Calendar, CheckCircle2, Clock, CreditCard, Phone, Sparkles, User, } from "lucide-react";
import { formatearFecha } from "@/utils/dateUtils"
/* =========================================================
   HELPERS
========================================================= */

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
  if (!metodo) return "No indicado";

  const metodos = {
    yape: "Yape",
    plin: "Plin",
    transferencia: "Transferencia",
  };

  return metodos[metodo] || metodo;
}


/* =========================================================
   BADGE PAGO
========================================================= */

function PagoBadge({ pagoVerificado }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase leading-none ${
        pagoVerificado
          ? "bg-green-100 text-green-700"
          : "bg-amber-100 text-amber-800"
      }`}
    >
      {pagoVerificado ? (
        <>
          <CheckCircle2 size={12} />
          Verificado
        </>
      ) : (
        <>
          <AlertCircle size={12} />
          Pendiente
        </>
      )}
    </span>
  );
}

/* =========================================================
   BADGE ESTADO CITA
========================================================= */

function EstadoBadge({
  estado,
  pagoVerificado,
}) {
  if (!pagoVerificado) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-black uppercase text-amber-800">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
        Pendiente
      </span>
    );
  }

  const estadoNormalizado =
    estado?.toLowerCase();

  const atendida =
    estadoNormalizado === "atendido" ||
    estadoNormalizado === "atendida" ||
    estadoNormalizado === "asistió";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${
        atendida
          ? "bg-green-100 text-green-700"
          : "bg-pink-100 text-pink-700"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          atendida
            ? "bg-green-500"
            : "bg-pink-500"
        }`}
      />

      {atendida
        ? "Atendida"
        : estado || "Confirmada"}
    </span>
  );
}

/* =========================================================
   SERVICIOS
========================================================= */

function ServiciosDetalle({ servicios }) {
  if (!servicios.length) {
    return (
      <span className="text-xs text-gray-400">
        Sin servicios
      </span>
    );
  }

  return (
    <ul className="space-y-1.5">
      {servicios.map((servicio, index) => (
        <li
          key={`${servicio.id || index}-${index}`}
          className="flex items-start gap-2 text-xs font-semibold text-gray-800"
        >
          <Sparkles
            size={13}
            className="mt-0.5 shrink-0 text-nails-brown"
          />

          <span className="leading-tight">
            {servicio.nombre}

            {servicio.duracionMinutos ? (
              <span className="ml-1 font-normal text-gray-500">
                ({servicio.duracionMinutos} min)
              </span>
            ) : null}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* =========================================================
   COMPONENTE
========================================================= */

export default function AdminCitasTable({
  citas = [],
  onMarcarAsistencia,
  onConfirmarPago,
}) {
  const [filtroEstado, setFiltroEstado] =
    useState("todos");

  const [cargandoId, setCargandoId] =
    useState(null);

  /* =======================================================
     ACCIONES
  ======================================================= */

  const handleConfirmarPago = async (id) => {
    setCargandoId(id);

    try {
      await onConfirmarPago(id);
    } finally {
      setCargandoId(null);
    }
  };

  const handleMarcarAsistencia = async (
    id
  ) => {
    setCargandoId(id);

    try {
      await onMarcarAsistencia(id);
    } finally {
      setCargandoId(null);
    }
  };

  /* =======================================================
     FILTROS
  ======================================================= */

  const citasFiltradas = citas.filter(
    (cita) => {
      const pagoVerificado =
        normalizarBooleano(
          cita.pago_verificado
        );

      if (
        filtroEstado === "pendientes"
      ) {
        return !pagoVerificado;
      }

      if (
        filtroEstado === "confirmadas"
      ) {
        return pagoVerificado;
      }

      return true;
    }
  );

  const totalPendientes = citas.filter(
    (cita) =>
      !normalizarBooleano(
        cita.pago_verificado
      )
  ).length;

  const totalConfirmadas = citas.filter(
    (cita) =>
      normalizarBooleano(
        cita.pago_verificado
      )
  ).length;

  /* =======================================================
     SIN CITAS
  ======================================================= */

  if (!citas.length) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-xl sm:p-10">
        <Calendar className="mx-auto h-12 w-12 text-nails-brown/40" />

        <p className="mt-4 text-lg font-black text-gray-800 sm:text-xl">
          No hay citas agendadas
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Las nuevas citas aparecerán aquí automáticamente.
        </p>
      </div>
    );
  }

  /* =======================================================
     ACCIÓN
  ======================================================= */

  const renderAccion = (
    cita,
    pagoVerificado
  ) => {
    const estaProcesando =
      cargandoId === cita.id;

    if (!pagoVerificado) {
      return (
        <button
          type="button"
          disabled={estaProcesando}
          onClick={() =>
            handleConfirmarPago(cita.id)
          }
          className="w-full rounded-xl bg-nails-brown px-3 py-2 text-xs font-black text-white shadow-sm transition disabled:opacity-50 hover:text-nails-yellow"
        >
          {estaProcesando
            ? "Verificando..."
            : "Confirmar pago"}
        </button>
      );
    }

    return (
      <button
        type="button"
        disabled={estaProcesando}
        onClick={() =>
          handleMarcarAsistencia(cita.id)
        }
        className="w-full rounded-xl bg-green-700 px-3 py-2 text-xs font-black text-white shadow-sm transition hover:bg-green-800 disabled:opacity-50"
      >
        {estaProcesando
          ? "Procesando..."
          : "Marcar atendida"}
      </button>
    );
  };

  return (
    <section className="mx-auto w-full max-w-400 px-3 py-6 sm:px-5 lg:px-6 xl:px-8">
      <div className="w-full overflow-hidden rounded-3xl bg-white shadow-xl">

        {/* ===============================================
            FILTROS
        =============================================== */}

        <div className="flex w-full flex-wrap gap-2 border-b bg-gray-50 p-4 sm:gap-3 sm:p-5">
          <button
            type="button"
            onClick={() =>
              setFiltroEstado("todos")
            }
            className={`rounded-xl px-3 py-2 text-xs font-black transition sm:px-4 sm:text-sm ${
              filtroEstado === "todos"
                ? "bg-nails-brown text-white"
                : "border bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Todas ({citas.length})
          </button>

          <button
            type="button"
            onClick={() =>
              setFiltroEstado(
                "pendientes"
              )
            }
            className={`rounded-xl px-3 py-2 text-xs font-black transition sm:px-4 sm:text-sm ${
              filtroEstado ===
              "pendientes"
                ? "bg-amber-700 text-white"
                : "border bg-white text-amber-700 hover:bg-amber-50"
            }`}
          >
            Pagos pendientes (
            {totalPendientes})
          </button>

          <button
            type="button"
            onClick={() =>
              setFiltroEstado(
                "confirmadas"
              )
            }
            className={`rounded-xl px-3 py-2 text-xs font-black transition sm:px-4 sm:text-sm ${
              filtroEstado ===
              "confirmadas"
                ? "bg-green-700 text-white"
                : "border bg-white text-green-700 hover:bg-green-50"
            }`}
          >
            Confirmadas (
            {totalConfirmadas})
          </button>
        </div>

        {citasFiltradas.length === 0 ? (
          <div className="p-8 text-center text-sm font-black text-gray-500">
            No existen citas para este  filtro.
          </div>
        ) : (
          <>
            {/* =============================================
                MÓVIL + TABLET
            ============================================= */}

            <div className="grid gap-4 p-4 xl:hidden">
              {citasFiltradas.map( (cita) => {
                  const servicios = obtenerServicios( cita.servicio );
                  const pagoVerificado = normalizarBooleano( cita.pago_verificado );
                  const totalMonto = Number( cita.total || 0 );
                  const montoReserva = Number( cita.monto_reserva ?? totalMonto * 0.2  );
                  const montoRestante = Number(  cita.monto_restante ?? totalMonto * 0.8 );
                  const numeroOperacion = cita.numero_operacion || cita.yape_operacion || "—";

                  return (
                    <article
                      key={cita.id}
                      className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm"
                    >
                      {/* CABECERA */}

                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-black uppercase text-nails-brown">
                            Cita #{cita.id}
                          </p>

                          <h3 className="mt-1 text-base font-black uppercase leading-tight text-gray-900">
                            {cita.cliente_nombre ||  "Cliente"}
                          </h3>
                        </div>

                        <EstadoBadge
                          estado={cita.estado}
                          pagoVerificado={ pagoVerificado }
                        />
                      </div>

                      <div className="grid gap-4">

                        {/* DATOS CLIENTE */}

                        <div>
                          <p className="text-[11px] font-black uppercase text-nails-brown">
                            Datos del cliente
                          </p>

                          <div className="mt-2 space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <User
                                size={15}
                                className="text-nails-brown"
                              />

                              <span className="font-bold text-gray-900">
                                {cita.cliente_nombre || "—"}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <Phone
                                size={15}
                                className="text-nails-brown"
                              />

                              <span className="font-semibold text-gray-700">
                                {cita.cliente_telefono || "Sin teléfono"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* FECHA / HORA */}

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-[11px] font-black uppercase text-nails-brown">
                              Fecha
                            </p>

                            <p className="mt-1 flex items-center gap-1 text-xs font-bold text-gray-800">
                              <Calendar
                                size={13}
                              />

                              {formatearFecha(cita.fecha_cita) || "Por acordar"}
                            </p>
                          </div>

                          <div>
                            <p className="text-[11px] font-black uppercase text-nails-brown">
                              Hora
                            </p>

                            <p className="mt-1 flex items-center gap-1 text-xs font-bold text-gray-800">
                              <Clock
                                size={13}
                              />
                              {cita.hora_cita || "Por acordar"}
                            </p>
                          </div>
                        </div>

                        {/* SERVICIOS */}

                        <div>
                          <p className="text-[11px] font-black uppercase text-nails-brown">
                            Servicios
                          </p>

                          <div className="mt-2">
                            <ServiciosDetalle
                              servicios={ servicios }
                            />
                          </div>
                        </div>

                        {/* PAGO */}

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-[11px] font-black uppercase text-nails-brown">
                              Método
                            </p>

                            <p className="mt-1 flex items-center gap-1 text-xs font-bold text-gray-800">
                              <CreditCard
                                size={13}
                              />

                              {formatearMetodoPago( cita.metodo_pago )}
                            </p>
                          </div>

                          <div>
                            <p className="text-[11px] font-black uppercase text-nails-brown">
                              N° operación
                            </p>

                            <p className="mt-1 break-all text-xs font-bold text-gray-800">
                              {numeroOperacion}
                            </p>
                          </div>
                        </div>

                        {/* MONTOS */}

                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <p className="text-[10px] font-black uppercase text-nails-brown">
                              Total
                            </p>

                            <p className="mt-1 text-sm font-black text-gray-900">
                              S/{" "} {totalMonto.toFixed( 2 )}
                            </p>
                          </div>

                          <div>
                            <p className="text-[10px] font-black uppercase text-nails-brown">
                              Reserva
                            </p>

                            <p className="mt-1 text-sm font-black text-nails-brown">
                              S/{" "} {montoReserva.toFixed( 2 )}
                            </p>
                          </div>

                          <div>
                            <p className="text-[10px] font-black uppercase text-nails-brown">
                              Restante
                            </p>

                            <p className="mt-1 text-sm font-black text-gray-900">
                              S/{" "} {montoRestante.toFixed( 2 )}
                            </p>
                          </div>
                        </div>

                        {/* ESTADO PAGO */}

                        <div>
                          <p className="text-[11px] font-black uppercase text-nails-brown">
                            Estado del pago
                          </p>

                          <div className="mt-2">
                            <PagoBadge
                              pagoVerificado={ pagoVerificado }
                            />
                          </div>
                        </div>

                        {/* ACCIÓN */}

                        <div className="pt-1">
                          {renderAccion( cita, pagoVerificado )}
                        </div>
                      </div>
                    </article>
                  );
                }
              )}
            </div>

            {/* =============================================
                ESCRITORIO
            ============================================= */}

            <div className="hidden w-full xl:block">
              <table className="w-full table-auto border-collapse text-left text-[11px] 2xl:text-xs">
                <colgroup>
                  <col className="w-[5%]" />
                  <col className="w-[14%]" />
                  <col className="w-[11%]" />
                  <col className="w-[18%]" />
                  <col className="w-[10%]" />
                  <col className="w-[9%]" />
                  <col className="w-[8%]" />
                  <col className="w-[8%]" />
                  <col className="w-[8%]" />
                  <col className="w-[9%]" />
                </colgroup>

                <thead className="bg-nails-brown font-black uppercase tracking-wider text-nails-white">
                  <tr>
                    <th className="px-3 py-4">
                      ID
                    </th>

                    <th className="px-3 py-4">
                      Cliente
                    </th>

                    <th className="px-3 py-4">
                      Fecha / Hora
                    </th>

                    <th className="px-3 py-4">
                      Servicios
                    </th>

                    <th className="px-3 py-4">
                      Pago
                    </th>

                    <th className="px-3 py-4">
                      Operación
                    </th>

                    <th className="px-3 py-4">
                      Reserva
                    </th>

                    <th className="px-3 py-4">
                      Restante
                    </th>

                    <th className="px-3 py-4 text-center">
                      Estado
                    </th>

                    <th className="px-3 py-4 text-center">
                      Acción
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-black/20">
                  {citasFiltradas.map( (cita) => { 
                     const servicios = obtenerServicios( cita.servicio );
                     const pagoVerificado = normalizarBooleano( cita.pago_verificado );
                     const totalMonto = Number( cita.total || 0 );
                     const montoReserva = Number( cita.monto_reserva ?? totalMonto * 0.2 );
                     const montoRestante = Number( cita.monto_restante ??  totalMonto * 0.8 );
                     const numeroOperacion = cita.numero_operacion ||  cita.yape_operacion || "—";

                      return (
                        <tr
                          key={cita.id}
                          className="align-top transition-colors hover:bg-gray-50"
                        >
                          {/* ID */}

                          <td className="px-3 py-4 font-black text-gray-900">
                            #{cita.id}
                          </td>

                          {/* CLIENTE */}

                          <td className="px-3 py-4">
                            <div className="space-y-1.5">
                              <div className="flex items-start gap-1.5">
                                <User
                                  size={14}
                                  className="mt-0.5 shrink-0 text-nails-brown"
                                />

                                <span className="font-black uppercase leading-tight text-gray-900">
                                  {cita.cliente_nombre || "—"}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <Phone
                                  size={13}
                                  className="shrink-0 text-gray-500"
                                />

                                <span className="font-semibold text-gray-600">
                                  {cita.cliente_telefono || "Sin teléfono"}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* FECHA */}

                          <td className="px-3 py-4">
                            <div className="space-y-1.5">
                              <span className="flex items-center gap-1 font-bold text-gray-800">
                                <Calendar
                                  size={ 12 }
                                />
                                {formatearFecha(cita.fecha_cita) || "—"}
                              </span>

                              <span className="flex items-center gap-1 text-gray-600">
                                <Clock
                                  size={12}
                                />

                                {cita.hora_cita || "—"}
                              </span>
                            </div>
                          </td>

                          {/* SERVICIO */}

                          <td className="px-3 py-4">
                            <ServiciosDetalle
                              servicios={ servicios }
                            />
                          </td>

                          {/* MÉTODO */}

                          <td className="px-3 py-4 font-bold text-gray-800">
                            {formatearMetodoPago( cita.metodo_pago )}
                          </td>

                          {/* OPERACIÓN */}

                          <td className="px-3 py-4 break-all font-mono font-bold text-gray-700">
                            {numeroOperacion}
                          </td>

                          {/* RESERVA */}

                          <td className="whitespace-nowrap px-3 py-4 font-black text-nails-brown">
                            S/{" "} {montoReserva.toFixed( 2 )}
                          </td>

                          {/* RESTANTE */}

                          <td className="whitespace-nowrap px-3 py-4 font-black text-gray-900">
                            S/{" "} {montoRestante.toFixed( 2 )}
                          </td>

                          {/* ESTADO */}

                          <td className="px-3 py-4 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <PagoBadge
                                pagoVerificado={ pagoVerificado }
                              />

                              <EstadoBadge
                                estado={ cita.estado }
                                pagoVerificado={ pagoVerificado}
                              />
                            </div>
                          </td>

                          {/* ACCIÓN */}

                          <td className="px-3 py-4 text-center">
                            {renderAccion(cita, pagoVerificado )}
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
}