"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, Sparkles, Smartphone, Landmark,} from "lucide-react";

import { crearCita } from "@/services/functionServices";

const PORCENTAJE_RESERVA = 0.2;

const DATOS_PAGO = {
  yape: {
    nombre: "Yape",
    numero: "929 943 978",
    titular: "Nails Vibe",
    qr: "/branding/yape-qr.webp",
  },

  plin: {
    nombre: "Plin",
    numero: "929 943 978",
    titular: "Nails Vibe",
    qr: "/branding/yape-qr.webp",
  },

  transferencia: {
    nombre: "Transferencia bancaria",
    banco: "BCP",
    titular: "Nails Vibe",
    cuenta: "125-8445054321",
    cci: "32649840312678677844",
  },
};

export default function CheckoutPanel({
  carrito,
  total,
  onClose,
  onCitaCreada,
}) {
  const router = useRouter();

  const itemsServicio = Array.isArray(carrito) ? carrito: [];

  /* =========================
     DATOS DEL CLIENTE
  ========================= */

  const [clienteNombre, setClienteNombre] = useState("");

  const [clienteTelefono, setClienteTelefono] = useState("");

  /* =========================
     CITA
  ========================= */

  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  /* =========================
     PAGO
  ========================= */

  const [metodoPago, setMetodoPago] =  useState("yape");
  const [numeroOperacion, setNumeroOperacion] = useState("");

  /* =========================
     ESTADOS
  ========================= */
  const [cargando, setCargando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");

  /* =========================
     ERRORES
  ========================= */

  const [nombreError, setNombreError] = useState("");
  const [telefonoError, setTelefonoError] = useState("");
  const [fechaError, setFechaError] = useState("");
  const [horaError, setHoraError] = useState("");
  const [pagoError, setPagoError] = useState("");

  /* =========================
     TOTALES
  ========================= */

  const totalServicio = Number(total) || 0;
  const montoReserva =  totalServicio * PORCENTAJE_RESERVA;
  const montoRestante = totalServicio - montoReserva;
  const datosPago = DATOS_PAGO[metodoPago];

  /* =========================
     CAMBIAR MÉTODO DE PAGO
  ========================= */

  const cambiarMetodoPago = (metodo) => {
    setMetodoPago(metodo);
    setNumeroOperacion("");
    setPagoError("");
  };

  /* =========================
     CONFIRMAR CITA
  ========================= */

  const confirmarCita = async () => {
    setNombreError("");
    setTelefonoError("");
    setFechaError("");
    setHoraError("");
    setPagoError("");
    setMensajeExito("");

    const nombreLimpio = clienteNombre.trim();
    const telefonoLimpio = clienteTelefono.replace(/\D/g, "");
    const operacionLimpia = numeroOperacion.trim();
    let hayError = false;

    /* Nombre */

    if (!nombreLimpio) {
      setNombreError( "Ingresa tu nombre para agendar la cita.");
      hayError = true;
    }

    /* Teléfono */

    if (!telefonoLimpio) {
      setTelefonoError( "Ingresa tu número de celular.");

      hayError = true;
    } else if (
      !/^9\d{8}$/.test(telefonoLimpio)
    ) {
      setTelefonoError( "Ingresa un celular válido de 9 dígitos.");
      hayError = true;
    }

    /* Fecha */

    if (!fecha) {
      setFechaError(  "Selecciona una fecha.");
      hayError = true;
    }

    /* Hora */

    if (!hora) {
      setHoraError( "Selecciona una hora." );
      hayError = true;
    }

    /* Operación */

    if (!operacionLimpia) {
      setPagoError(
        "Ingresa el número de operación del pago.");
         hayError = true;
    }

    if (hayError) return;
    if (itemsServicio.length === 0) return;
    if (totalServicio <= 0) return;

    try {
      setCargando(true);

      const data = {
        cliente_nombre: nombreLimpio,
        cliente_telefono: telefonoLimpio,
        fecha_cita: fecha,
        hora_cita: hora,
        metodo_pago: metodoPago,
        numero_operacion: operacionLimpia,
        servicio: itemsServicio.map(
          (item) => ({
            id: item.id,
            nombre: item.nombre,
            precio: Number( item.precio),
            cantidad: Number( item.cantidad || 1 ),
            duracionMinutos: Number( item.duracionMinutos || 0 ),
          })
        ),
       total: totalServicio,
       monto_reserva: montoReserva,
       monto_restante: montoRestante,
      };

      const respuesta = await crearCita(data);

      const idRegistrado = respuesta?.id || respuesta?.citaId || respuesta?.servicioId;

      if (!idRegistrado) {
        throw new Error(
          "No se recibió el número de confirmación para la cita."
        );
      }

      setMensajeExito( "Cita registrada correctamente. Redirigiendo..." );

      localStorage.removeItem( "carrito" );

      if (onCitaCreada) {
        onCitaCreada();
      }

      router.push( `/cita/${idRegistrado}` );
    } catch (error) {
      console.error(
        "Error al registrar la cita:",
        error
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div  className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 px-3 py-3 backdrop-blur-sm sm:px-4 sm:py-6 ">
      {/* MODAL */}
      <div className=" flex h-full max-h-[96vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl  bg-nails-brown/40 shadow-2xl sm:h-auto sm:max-h-[90vh] sm:rounded-3xl ">
        {/* =========================
            HEADER
        ========================== */}

        <div className=" flex shrink-0 items-center justify-between border-b  bg-nails-brown px-4 py-4  sm:px-6 sm:py-5 ">
          <h2 className=" font-title text-lg font-bold  text-nails-yellow  sm:text-2xl " >
            CONFIRMAR CITA
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className=" rounded-full   bg-nails-caramelo p-2  text-nails-white transition hover:bg-nails-gold  hover:text-nails-white "
           >
            <X size={20} />
          </button>
        </div>

        {/* =========================
            CONTENIDO CON SCROLL
        ========================== */}

        <div className=" min-h-0 flex-1 overflow-y-auto  px-4 pb-6 sm:px-6 ">
          <p className=" mt-3 text-center text-xs font-black  text-nails-white sm:text-sm ">
            ¡Al confirmar el pago, tu cita quedará registrada!
          </p>

          {/* =========================
              SERVICIOS
          ========================== */}

          <div className=" mt-5 max-h-56 space-y-3 overflow-y-auto rounded-2xl  p-2 sm:p-3 " >
            {itemsServicio.map(
              (item) => {
                const precio = Number(item.precio) * Number( item.cantidad || 1 );
                const reservaServicio = precio * PORCENTAJE_RESERVA;

                return (
                  <div
                    key={item.id}
                    className=" flex items-center justify-between gap-3 rounded-2xl px-2 py-3 text-xs  font-bold sm:px-4 "
                  >
                    <div className=" flex  min-w-0 items-center  gap-2 " >
                      <Sparkles
                        size={20}
                        className=" shrink-0  text-nails-yellow "
                      />

                      <div className="min-w-0">
                        <p className=" text-nails-white ">  {item.nombre}</p>

                        <p className="  mt-1 text-xs font-medium  text-nails-white/70 " >
                          Precio: S/{" "}
                          {precio.toFixed( 2 )}
                        </p>
                      </div>
                    </div>

                    <div className=" shrink-0 text-right " >
                      <p className=" text-xs  font-medium  text-nails-yellow " >  Reserva 20% </p>

                      <p className="  text-sm font-bold  text-nails-white sm:text-base ">
                        S/{" "}
                        {reservaServicio.toFixed( 2 )}
                      </p>
                    </div>
                  </div>
                );
              }
            )}
          </div>

          {/* =========================
              DATOS CLIENTE
          ========================== */}

          <div className="mt-6">
            <label className=" font-title text-lg  font-bold  text-nails-yellow " >
               Datos del cliente
            </label>

            <div className=" mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 " >
              {/* Nombre */}

              <div>
                <label
                  htmlFor="clienteNombre"
                  className=" text-xs font-bold tracking-wider  text-nails-yellow "
                >
                  Nombre y apellido
                  <span className="text-red-700">  {" "}* </span>
                </label>

                <input
                  id="clienteNombre"
                  type="text"
                  value={clienteNombre}
                  onChange={(e) => {
                    setClienteNombre(
                      e.target.value
                    );

                    if (nombreError) {
                      setNombreError("");
                    }
                  }}
                  placeholder="Ej: María López"
                  className=" mt-2 w-full rounded-xl border  border-gray-200  bg-white px-4 py-3  text-sm  font-semibol  text-gray-70    shadow-sm outline-none "
                />

                {nombreError && (
                  <p  className="  mt-2 text-xs font-bold text-red-700 " >
                    {nombreError}
                  </p>
                )}
              </div>

              {/* Teléfono */}

              <div>
                <label
                  htmlFor="clienteTelefono"
                  className="  text-xs font-bold  tracking-wider text-nails-yellow "
                >
                  Celular
                  <span className="text-red-700">
                    {" "}*
                  </span>
                </label>

                <input
                  id="clienteTelefono"
                  type="tel"
                  inputMode="numeric"
                  maxLength={9}
                  value={clienteTelefono}
                  onChange={(e) => {
                    const valor =
                      e.target.value.replace(
                        /\D/g,
                        ""
                      );

                    setClienteTelefono( valor );

                    if (telefonoError) {
                      setTelefonoError( "" );
                    }
                  }}
                  placeholder="Ej: 987654321"
                  className=" mt-2  w-full rounded-xl border border-gray-200  bg-white py-3  text-sm font-semibold text-gray-700 shadow-sm outline-none  "
                />

                {telefonoError && (
                  <p className=" mt-2 text-xs font-bold text-red-700 " >
                    {telefonoError}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* =========================
              FECHA Y HORA
          ========================== */}

          <div className=" mt-6 flex flex-col gap-4 " >
            <label className=" font-title text-lg font-bold text-nails-yellow " >
              ¿Para cuándo desea agendar su cita?
              <span className="text-red-700">
                {" "}*
              </span>
            </label>

            <div className=" grid grid-cols-1 gap-4 sm:grid-cols-2 " >
              
              {/* Fecha */}

              <div  className=" flex  flex-col gap-1.5  " >
                <label className="  text-xs font-bold tracking-wider  text-nails-yellow " >
                  Fecha de Reserva
                </label>

                <input
                  type="date"
                  value={fecha}
                  min={ new Date().toISOString().split("T")[0] }
                  onChange={(e) => { setFecha( e.target.value );

                    if (fechaError) {
                      setFechaError("");
                    }
                  }}
                  className=" w-full  rounded-xl  border  border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm outline-none " />

                {fechaError && (
                  <p className="text-xs font-bold text-red-700 " >
                    {fechaError}
                  </p>
                )}
              </div>

              {/* Hora */}

              <div className=" flex flex-col gap-1.5 " >
                <label className=" text-xs font-bold tracking-wider text-nails-yellow ">
                  Hora Preferida
                </label>

                <input
                  type="time"
                  value={hora}
                  onChange={(e) => {
                    setHora( e.target.value );

                    if (horaError) {
                      setHoraError("");
                    }
                  }}
                  className=" w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm outline-none "
                />

                {horaError && (
                  <p  className="text-xs font-bold text-red-700 "> {horaError} </p>
                )}
              </div>
            </div>
          </div>

          {/* =========================
              MÉTODO DE PAGO
          ========================== */}

          <div className="mt-6">
            <label className=" font-title text-lg font-bold  text-nails-yellow ">
              Método de pago
              <span className="text-red-700">
                {" "}*
              </span>
            </label>

            <div className=" mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3 " >
              {/* YAPE */}

              <button
                type="button"
                onClick={() =>
                  cambiarMetodoPago( "yape")
                }
                className={` flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-bold transition
                  ${ metodoPago ==="yape"
                      ? "border-nails-gold bg-nails-caramelo text-nails-white"
                      : "border-nails-gold bg-nails-white text-nails-brown"
                  }
                `}
              >
                <Smartphone
                  size={17}
                />
                Yape
              </button>

              {/* PLIN */}

              <button
                type="button"
                onClick={() =>
                  cambiarMetodoPago( "plin" )
                }
                className={` flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-bold transition
                  ${ metodoPago === "plin"
                      ? "border-nails-gold bg-nails-caramelo text-nails-white"
                      : "border-nails-gold bg-nails-white text-nails-brown"
                  }
                `}
              >
                <Smartphone
                  size={17}
                />

                Plin
              </button>

              {/* TRANSFERENCIA */}

              <button
                type="button"
                onClick={() =>
                  cambiarMetodoPago( "transferencia" )
                }
                className={` flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-bold transition
                  ${
                    metodoPago === "transferencia"
                      ? "border-nails-gold bg-nails-caramelo text-nails-white"
                      : "border-nails-gold bg-nails-white text-nails-brown"
                  }
                `}
              >
                <Landmark
                  size={17}
                />

                Transferencia
              </button>
            </div>
          </div>

          {/* =========================
              DATOS DINÁMICOS DE PAGO
          ========================== */}

          <div className=" mt-4 rounded-2xl border border-nails-gold p-4 " >
            {(metodoPago === "yape" || metodoPago === "plin") && ( 
              <div className=" flex flex-col items-center gap-4 sm:flex-row sm:justify-between " >
                <div className=" text-center sm:text-left " >
                  <p className="  font-title text-lg font-bold text-nails-yellow ">
                    {datosPago.nombre}
                  </p>

                  <p className="  mt-2 text-xs  text-nails-white/70 ">
                    Realiza el pago de la reserva al número:
                  </p>

                  <p className="  mt-2 text-xl font-black text-nails-white ">
                    {datosPago.numero}
                  </p>

                  <p className="  mt-1 text-xs text-nails-white/70 " >
                    Titular:{" "}
                    {datosPago.titular}
                  </p>
                </div>

                {datosPago.qr && (
                  <div className=" relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl bg-nails-gold p-2 sm:h-36 sm:w-36 " >
                    <Image
                      src={ datosPago.qr }
                      alt={`QR de ${datosPago.nombre}`}
                      fill
                      sizes="144px"
                      className=" object-contain p-2 "
                    />
                  </div>
                )}
              </div>
            )}

            {metodoPago === "transferencia" && (
              <div>
                <p className=" font-title text-lg font-bold text-nails-yellow " >
                  Transferencia bancaria
                </p>

                <div className=" mt-3 space-y-2 text-sm text-nails-white " >
                  <p><span className="font-bold"> Banco: </span>{" "} {datosPago.banco} </p>

                  <p> <span className="font-bold"> Titular: </span>{" "} {datosPago.titular} </p>

                  <p> <span className="font-bold"> Cuenta: </span>{" "} {datosPago.cuenta} </p>

                  <p className="break-all"> <span className="font-bold"> CCI: </span>{" "} {datosPago.cci} </p>
                </div>
              </div>
            )}
          </div>

          {/* =========================
              NÚMERO DE OPERACIÓN
          ========================== */}

          <div className="mt-5">
            <label htmlFor="numeroOperacion" className="  font-title text-base text-nails-yellow " >
              Número de operación
              <span className="text-red-700"> {" "}* </span>
            </label>

            <input
              id="numeroOperacion"
              type="text"
              inputMode="numeric"
              value={numeroOperacion}
              onChange={(e) => {
                setNumeroOperacion(
                  e.target.value
                );

                if (pagoError) {
                  setPagoError("");
                }
              }}
              placeholder={ metodoPago === "transferencia" ? 
                "Ingresa el número de operación de la transferencia"
                  : `Ingresa el ID de operación de ${datosPago.nombre}`
              }
              className=" mt-2 w-full rounded-2xl border border-nails-gold bg-nails-white px-4 py-3 outline-none  focus:border-nails-caramelo "
            />

            {pagoError && (
              <p className=" mt-2  text-xs font-bold text-red-700 ">
                {pagoError}
              </p>
            )}
          </div>
        </div>

        {/* =========================
            FOOTER
        ========================== */}

        <div className="shrink-0 border-t  bg-nails-brown px-4 py-4 sm:px-6 sm:py-5 " >
          <div className=" flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between " >
            <div>
              <p className=" text-xs font-semibold text-nails-white sm:text-sm " >
                Reserva a pagar ahora
              </p>

              <p className=" text-lg font-black text-nails-yellow sm:text-xl " >
                S/{" "}
                {montoReserva.toFixed( 2 )}
              </p>

              <p className=" mt-1 text-xs text-nails-white/70 " >
                Saldo restante: S/{" "}
                {montoRestante.toFixed( 2 )}
              </p>
            </div>

            <button
              type="button"
              onClick={ confirmarCita }
              disabled={cargando}
              className=" nails-button-remove w-ful sm:w-auto disabled:cursor-not-allowed disabled:opacity-60 "
         >
              {cargando
                ? "Enviando..."
                : "Confirmar cita"}
            </button>
          </div>

          {mensajeExito && (
            <div className=" mt-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3  text-sm font-bo  text-green-700 ">
              {mensajeExito}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}