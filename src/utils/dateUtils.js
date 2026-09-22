function crearFechaLocal(fecha) {
  if (!fecha) return null;

  const [year, month, day] = String(fecha)
    .slice(0, 10)
    .split("-")
    .map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(
    year,
    month - 1,
    day,
    12,
    0,
    0
  );
}

export function formatearFecha(fecha) {
  const fechaLocal = crearFechaLocal(fecha);

  if (!fechaLocal) return "";

  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(fechaLocal);
}

export function formatearHora(hora) {
  if (!hora) return "";

  try {
    const [horas, minutos] = String(hora)
      .split(":")
      .map(Number);

    const fecha = new Date();

    fecha.setHours(
      horas,
      minutos,
      0,
      0
    );

    return new Intl.DateTimeFormat("es-PE", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(fecha);
  } catch {
    return hora;
  }
}