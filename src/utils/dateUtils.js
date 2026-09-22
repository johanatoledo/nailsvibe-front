const formatearFecha = (fecha) => {
  if (!fecha) return "";

  try {
    const fechaTexto = String(fecha);
    const [year, month, day] = fechaTexto
      .slice(0, 10)
      .split("-")
      .map(Number);

    if (!year || !month || !day) {
      return "";
    }

    const fechaLocal = new Date(
      year,
      month - 1,
      day,
      12,
      0,
      0
    );

    return new Intl.DateTimeFormat("es-PE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(fechaLocal);
  } catch (error) {
    console.error(
      "Error formateando fecha:",
      fecha,
      error
    );

    return "";
  }
};