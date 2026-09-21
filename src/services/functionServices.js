const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

const CITAS_URL = `${API_URL}/api/citas`;

const headersJson = {
  "Content-Type": "application/json",
  "Bypass-Tunnel-Reminder": "true",
};

/* ============================================================
   MANEJAR RESPUESTAS DE LA API
============================================================ */

async function manejarRespuesta(
  response,
  mensajeError
) {
  const data = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        mensajeError ||
        "Error en la solicitud"
    );
  }

  return data;
}

/* ============================================================
   CREAR CITA

   POST /api/citas
============================================================ */

export async function crearCita(data) {
  const response = await fetch( CITAS_URL, {
      method: "POST",
      mode: "cors",
      headers: headersJson,
      body: JSON.stringify(data),
    }
  );

  return manejarRespuesta(
    response,
    "No se pudo registrar la cita"
  );
}

/* ============================================================
   OBTENER TODAS LAS CITAS

   GET /api/citas
============================================================ */

export async function obtenerCitasAdmin() {
  const response = await fetch( CITAS_URL,{
      method: "GET",
      cache: "no-store",
    }
  );

  return manejarRespuesta(
    response,
    "No se pudieron obtener las citas"
  );
}

/* ============================================================
   OBTENER CITA POR ID

   GET /api/citas/:id
============================================================ */

export async function obtenerCita(id) {
  if (!id) {
    throw new Error(
      "El ID de la cita es obligatorio"
    );
  }

  const response = await fetch( `${CITAS_URL}/${id}`, {
      method: "GET",
      cache: "no-store",
    }
  );

  return manejarRespuesta(
    response,
    "No se pudieron obtener los datos de la cita"
  );
}

/* ============================================================
   CONFIRMAR PAGO DE RESERVA

   PATCH /api/citas/:id/pago
============================================================ */

export async function confirmarPagoReserva( id ) {
  if (!id) {
    throw new Error(
      "El ID de la cita es obligatorio"
    );
  }

  const response = await fetch( `${CITAS_URL}/${id}/pago`, {
      method: "PATCH",
      mode: "cors",
      headers: headersJson,
    }
  );

  return manejarRespuesta(
    response,
    "No se pudo confirmar el pago de la reserva"
  );
}

/* ============================================================
   MARCAR CITA COMO ATENDIDA

   PATCH /api/citas/:id/atender
============================================================ */

export async function marcarAsistenciaCita( id ) {
  if (!id) {
    throw new Error(
      "El ID de la cita es obligatorio"
    );
  }

  const response = await fetch( `${CITAS_URL}/${id}/atender`, {
      method: "PATCH",
      mode: "cors",
      headers: headersJson,
    }
  );

  return manejarRespuesta(
    response,
    "No se pudo marcar la cita como atendida"
  );
}

/* ============================================================
   CANCELAR CITA

   PATCH /api/citas/:id/cancelar
============================================================ */

export async function cancelarCita(id) {
  if (!id) {
    throw new Error(
      "El ID de la cita es obligatorio"
    );
  }

  const response = await fetch( `${CITAS_URL}/${id}/cancelar`, {
      method: "PATCH",
      mode: "cors",
      headers: headersJson,
    }
  );

  return manejarRespuesta(
    response,
    "No se pudo cancelar la cita"
  );
}