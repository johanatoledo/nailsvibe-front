"use client";

import { useCallback, useEffect, useState } from "react";

import Navbar from "@/components/Navbar";
import AdminCitasTable from "@/components/AdminCitasTable";

import { confirmarPagoReserva, marcarAsistenciaCita, obtenerCitasAdmin, } from "@/services/functionServices";

/* ============================================================
   PÁGINA ADMINISTRATIVA DE CITAS
============================================================ */

export default function AdminCitasPage() {
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  /* ==========================================================
     OBTENER CITAS
  ========================================================== */

  const cargarCitas = useCallback(async () => {
    try {
      setError("");

      const data = await obtenerCitasAdmin();

      setCitas(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "Error al cargar citas:",
        error
      );

      setError(
        error.message ||
          "No se pudieron cargar las citas"
      );
    } finally {
      setCargando(false);
    }
  }, []);

  /* ==========================================================
     ACTUALIZACIÓN AUTOMÁTICA
  ========================================================== */

  useEffect(() => {
    cargarCitas();

    const intervalo = setInterval(
      cargarCitas,
      10000
    );

    return () =>
      clearInterval(intervalo);
  }, [cargarCitas]);

  /* ==========================================================
     CONFIRMAR PAGO
  ========================================================== */

  const confirmarPago = async (id) => {
    try {
      const respuesta =
        await confirmarPagoReserva(id);

      setCitas((prev) =>
        prev.map((cita) =>
          Number(cita.id) === Number(id)
            ? {
                ...cita,

                pago_verificado:
                  respuesta?.pago_verificado ??
                  true,

                pago_confirmado_en:
                  respuesta?.pago_confirmado_en ??
                  cita.pago_confirmado_en,

                estado:
                  respuesta?.estado ??
                  "confirmada",
              }
            : cita
        )
      );
    } catch (error) {
      console.error(
        "Error al confirmar pago:",
        error
      );

      throw error;
    }
  };

  /* ==========================================================
     MARCAR CITA COMO ATENDIDA
  ========================================================== */

  const marcarAsistencia = async (id) => {
    try {
      const respuesta =
        await marcarAsistenciaCita(id);

      setCitas((prev) =>
        prev.map((cita) =>
          Number(cita.id) === Number(id)
            ? {
                ...cita,
                estado:
                  respuesta?.estado ??
                  "atendida",
              }
            : cita
        )
      );
    } catch (error) {
      console.error(
        "Error al marcar cita como atendida:",
        error
      );

      throw error;
    }
  };

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <main className="min-h-screen bg-nails-champagne">
      <Navbar />

      <section className="mx-auto w-full max-w-400 px-3 py-6 sm:px-5 sm:py-8 lg:px-6 xl:px-8">
        {/* ====================================================
            CABECERA
        ==================================================== */}

        <div className="mb-6 flex flex-col gap-4 sm:mb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-black text-nails-brown sm:text-3xl lg:text-4xl">
              Panel de citas
            </h1>

            <p className="mt-1 text-sm font-medium text-gray-600">
              Gestiona las reservas y pagos de Nails Vibe.
            </p>
          </div>

          <button
            type="button"
            onClick={cargarCitas}
            disabled={cargando}
            className="w-fit rounded-xl bg-nails-brown px-4 py-2 text-sm font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cargando
              ? "Actualizando..."
              : "Actualizar"}
          </button>
        </div>

        {/* ====================================================
            ERROR
        ==================================================== */}

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {error}
          </div>
        ) : null}

        {/* ====================================================
            CONTENIDO
        ==================================================== */}

        {cargando && citas.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-xl">
            <p className="font-black text-nails-brown">
              Cargando citas...
            </p>
          </div>
        ) : (
          <AdminCitasTable
            citas={citas}
            onConfirmarPago={ confirmarPago }
            onMarcarAsistencia={ marcarAsistencia }
          />
        )}
      </section>
    </main>
  );
}