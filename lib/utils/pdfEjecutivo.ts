import jsPDF from "jspdf";
import { Observacion } from "@/types/observacion";

export function generarPDFEjecutivo(
  observaciones: Observacion[]
) {
  const pdf = new jsPDF("p", "mm", "a4");

  const hoy = new Date().toLocaleDateString();

  const total = observaciones.length;

  const pendientes = observaciones.filter(
    (o) => o.estado === "Pendiente"
  ).length;

  const enProceso = observaciones.filter(
    (o) => o.estado === "En proceso"
  ).length;

  const cerradas = observaciones.filter(
    (o) => o.estado === "Cerrado"
  ).length;

  const vencidas = observaciones.filter((o) => {
    return (
      o.estado !== "Cerrado" &&
      o.fechaCompromiso <
        new Date().toISOString().split("T")[0]
    );
  }).length;

  const bajo = observaciones.filter(
    (o) => o.riesgo === "Bajo"
  ).length;

  const medio = observaciones.filter(
    (o) => o.riesgo === "Medio"
  ).length;

  const alto = observaciones.filter(
    (o) => o.riesgo === "Alto"
  ).length;

  const critico = observaciones.filter(
    (o) => o.riesgo === "Crítico"
  ).length;

  const cumplimiento =
    total > 0
      ? ((cerradas / total) * 100).toFixed(1)
      : "0";

  pdf.setFontSize(18);

  pdf.text(
    "REPORTE EJECUTIVO SSOMA",
    105,
    15,
    { align: "center" }
  );

  pdf.setFontSize(10);

  pdf.text(
    `Fecha de emisión: ${hoy}`,
    15,
    25
  );

  pdf.line(10, 30, 200, 30);

  pdf.setFontSize(13);

  pdf.text(
    "RESUMEN GENERAL",
    15,
    40
  );

  pdf.setFontSize(10);

  pdf.text(
    `Total observaciones: ${total}`,
    20,
    50
  );

  pdf.text(
    `Pendientes: ${pendientes}`,
    20,
    58
  );

  pdf.text(
    `En proceso: ${enProceso}`,
    20,
    66
  );

  pdf.text(
    `Cerradas: ${cerradas}`,
    20,
    74
  );

  pdf.text(
    `Vencidas: ${vencidas}`,
    20,
    82
  );

  pdf.text(
    `Cumplimiento: ${cumplimiento}%`,
    20,
    90
  );

  pdf.line(10, 98, 200, 98);

  pdf.setFontSize(13);

  pdf.text(
    "RESUMEN POR RIESGO",
    15,
    108
  );

  pdf.setFontSize(10);

  pdf.text(`Bajo: ${bajo}`, 20, 118);
  pdf.text(`Medio: ${medio}`, 20, 126);
  pdf.text(`Alto: ${alto}`, 20, 134);
  pdf.text(`Crítico: ${critico}`, 20, 142);

  pdf.line(10, 150, 200, 150);

  pdf.setFontSize(13);

  pdf.text(
    "RESUMEN POR ÁREA",
    15,
    160
  );

  const resumenArea = observaciones.reduce(
    (acc: Record<string, number>, item) => {
      acc[item.area] =
        (acc[item.area] || 0) + 1;
      return acc;
    },
    {}
  );

  let y = 170;

  Object.entries(resumenArea).forEach(
    ([area, cantidad]) => {
      pdf.text(
        `${area}: ${cantidad}`,
        20,
        y
      );

      y += 8;
    }
  );

  pdf.save(
    `REPORTE_EJECUTIVO_SSOMA.pdf`
  );
}