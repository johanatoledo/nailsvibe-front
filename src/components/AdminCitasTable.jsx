"use client";

import { useState } from "react";
import { CheckCircle2, Clock, AlertCircle, Calendar, User, CreditCard } from "lucide-react";

function EstadoBadge({ estado, pagoVerificado }) {
  if (!pagoVerificado) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200">
        <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
        Pendiente Pago
      </span>
    );
  }

  const asistio = estado?.toLowerCase() === "atendido" || estado?.toLowerCase() === "asistió";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
        asistio
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
          : "bg-pink-50 text-pink-700 border border-pink-200"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          asistio ? "bg-emerald-500" : "bg-pink-500 animate-ping"
        }`}
      ></span>
      {estado || "Cita Confirmada"}
    </span>
  );
}

function PagoBadge({ pagoVerificado }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
        pagoVerificado
          ? "bg-green-100 text-green-800"
          : "bg-rose-100 text-rose-800"
      }`}
    >
      {pagoVerificado ? (
        <>
          <CheckCircle2 size={12} /> Adelanto Verificado
        </>
      ) : (
        <>
          <AlertCircle size={12} /> Revisar Yape
        </>
      )}
    </span>
  );
}

export default function AdminCitasTable({
  citas = [],
  onMarcarAsistencia,
  onConfirmarPago,
}) {
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [cargandoId, setCargandoId] = useState(null);

  const handleConfirmarPago = async (id) => {
    setCargandoId(id);
    try {
      await onConfirmarPago(id);
    } finally {
      setCargandoId(null);
    }
  };

  const handleMarcarAsistencia = async (id) => {
    setCargandoId(id);
    try {
      await onMarcarAsistencia(id);
    } finally {
      setCargandoId(null);
    }
  };

  function normalizarBooleano(valor) {
    return valor === true || valor === 1 || valor === "1";
  }

  const citasFiltradas = citas.filter((cita) => {
    const pagoVerificado = normalizarBooleano(cita.pago_verificado);
    if (filtroEstado === "pendientes") return !pagoVerificado;
    if (filtroEstado === "confirmadas") return pagoVerificado;
    return true;
  });

  const totalPendientes = citas.filter((c) => !normalizarBooleano(c.pago_verificado)).length;
  const totalConfirmadas = citas.filter((c) => normalizarBooleano(c.pago_verificado)).length;

  if (!citas.length) {
    return (
      <div className="rounded-3xl border border-pink-100 bg-white p-12 text-center shadow-sm">
        <Calendar className="mx-auto h-12 w-12 text-pink-300" />
        <p className="mt-4 text-xl font-bold text-gray-800">No hay citas agendadas</p>
        <p className="mt-1 text-sm text-gray-500">
          Las reservaciones realizadas desde el catálogo aparecerán aquí en tiempo real.
        </p>
      </div>
    );
  }

  return (
    <section className="w-full">
      <div className="overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-xl">
        {/* Barra de Filtros */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-pink-50/30 p-5">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFiltroEstado("todos")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                filtroEstado === "todos"
                  ? "bg-gray-900 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              Todas las Citas ({citas.length})
            </button>

            <button
              onClick={() => setFiltroEstado("pendientes")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                filtroEstado === "pendientes"
                  ? "bg-amber-600 text-white shadow-md"
                  : "bg-white text-amber-700 hover:bg-amber-50 border border-amber-200"
              }`}
            >
              Por Verificar Yape ({totalPendientes})
            </button>

            <button
              onClick={() => setFiltroEstado("confirmadas")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                filtroEstado === "confirmadas"
                  ? "bg-emerald-700 text-white shadow-md"
                  : "bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200"
              }`}
            >
              Reservas Confirmadas ({totalConfirmadas})
            </button>
          </div>
        </div>

        {/* Tabla de Citas */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1100px] table-auto border-collapse text-left text-sm">
            <thead className="bg-gray-900 text-xs font-bold uppercase tracking-wider text-pink-200">
              <tr>
                <th className="px-5 py-4">ID</th>
                <th className="px-5 py-4">Cliente</th>
                <th className="px-5 py-4">Fecha & Hora</th>
                <th className="px-5 py-4">Servicio(s)</th>
                <th className="px-5 py-4">Op. Yape</th>
                <th className="px-5 py-4">Reserva (20%)</th>
                <th className="px-5 py-4">Restante (80%)</th>
                <th className="px-5 py-4">Estado Pago</th>
                <th className="px-5 py-4 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 font-medium">
              {citasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-gray-400">
                    No hay reservaciones en este filtro.
                  </td>
                </tr>
              ) : (
                citasFiltradas.map((cita) => {
                  let serviciosList = [];
                  try {
                    serviciosList =
                      typeof cita.servicio === "string"
                        ? JSON.parse(cita.servicio)
                        : cita.servicio || [];
                  } catch {
                    serviciosList = [];
                  }

                  const pagoVerificado = normalizarBooleano(cita.pago_verificado);
                  const totalMonto = Number(cita.total || 0);
                  const montoReserva = totalMonto * 0.20;
                  const montoRestante = totalMonto * 0.80;
                  const estaProcesando = cargandoId === cita.id;

                  return (
                    <tr
                      key={cita.id}
                      className="hover:bg-pink-50/20 transition-colors"
                    >
                      {/* ID Cita */}
                      <td className="p-4 align-top font-bold text-gray-900">
                        #{cita.id}
                      </td>

                      {/* Cliente */}
                      <td className="p-4 align-top">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-pink-500" />
                          <span className="font-bold text-gray-800 uppercase">
                            {cita.cliente_nombre}
                          </span>
                        </div>
                      </td>

                      {/* Fecha y Hora Cita */}
                      <td className="p-4 align-top whitespace-nowrap">
                        <div className="flex flex-col gap-0.5 text-xs">
                          <span className="font-bold text-gray-800 flex items-center gap-1">
                            <Calendar size={12} className="text-gray-400" />
                            {cita.fecha_cita || "Por acordar"}
                          </span>
                          <span className="text-gray-500 flex items-center gap-1">
                            <Clock size={12} className="text-gray-400" />
                            {cita.hora_cita || "Por acordar"}
                          </span>
                        </div>
                      </td>

                      {/* Servicios Solicitados */}
                      <td className="p-4 align-top min-w-[200px]">
                        {serviciosList.length > 0 ? (
                          <ul className="space-y-1 text-xs">
                            {serviciosList.map((srv, idx) => (
                              <li key={idx} className="text-gray-700 font-semibold">
                                • {srv.nombre}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-xs text-gray-400">Servicio general</span>
                        )}
                      </td>

                      {/* Operación Yape */}
                      <td className="p-4 align-top font-mono font-bold text-gray-700">
                        <div className="flex items-center gap-1">
                          <CreditCard size={14} className="text-purple-600" />
                          {cita.yape_operacion || "—"}
                        </div>
                      </td>

                      {/* Monto Reserva 20% */}
                      <td className="p-4 align-top font-bold text-pink-600 whitespace-nowrap">
                        S/ {montoReserva.toFixed(2)}
                      </td>

                      {/* Monto Restante a Pagar en Salón */}
                      <td className="p-4 align-top font-bold text-gray-900 whitespace-nowrap">
                        S/ {montoRestante.toFixed(2)}
                      </td>

                      {/* Estado del Pago */}
                      <td className="p-4 align-top">
                        <PagoBadge pagoVerificado={pagoVerificado} />
                      </td>

                      {/* Botón de Acción */}
                      <td className="p-4 align-top text-center">
                        {!pagoVerificado ? (
                          <button
                            disabled={estaProcesando}
                            onClick={() => handleConfirmarPago(cita.id)}
                            className="w-full min-w-[130px] rounded-xl bg-purple-700 px-3 py-2 text-xs font-bold text-white hover:bg-purple-800 transition shadow-sm disabled:opacity-50"
                          >
                            {estaProcesando ? "Verificando..." : "Confirmar Yape"}
                          </button>
                        ) : (
                          <button
                            disabled={estaProcesando}
                            onClick={() => handleMarcarAsistencia(cita.id)}
                            className="w-full min-w-[130px] rounded-xl bg-emerald-700 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition shadow-sm disabled:opacity-50"
                          >
                            {estaProcesando ? "Procesando..." : "Marcar Atendido"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}