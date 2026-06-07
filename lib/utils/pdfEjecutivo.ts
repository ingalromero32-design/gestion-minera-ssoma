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
      
  const cumplimientoNumero =
  Number(cumplimiento);

  pdf.setFillColor(15, 23, 42);
  pdf.rect(0, 0, 210, 30, "F");

  pdf.setTextColor(255, 255, 255);

  pdf.setFontSize(20);

  pdf.text(
    "REPORTE EJECUTIVO SSOMA",
    105,
    15,
    {
      align: "center",
    }
  );

  pdf.setFontSize(10);

  pdf.text(
    `Fecha de emisión: ${hoy}`,
    105,
    23,
    {
      align: "center",
    }
  );

  pdf.setTextColor(0, 0, 0);

  function tarjeta(
    x: number,
    y: number,
    titulo: string,
    valor: string | number,
    color: number[]
  ) {
    pdf.setFillColor(
      color[0],
      color[1],
      color[2]
    );

    pdf.roundedRect(
      x,
      y,
      42,
      22,
      3,
      3,
      "F"
    );

    pdf.setTextColor(
      255,
      255,
      255
    );

    pdf.setFontSize(9);

    pdf.text(
      titulo,
      x + 3,
      y + 7
    );

    pdf.setFontSize(14);

    pdf.text(
      String(valor),
      x + 3,
      y + 17
    );

    pdf.setTextColor(
      0,
      0,
      0
    );
  }

  tarjeta(
    15,
    40,
    "TOTAL",
    total,
    [59, 130, 246]
  );

  tarjeta(
    62,
    40,
    "CERRADAS",
    cerradas,
    [34, 197, 94]
  );

  tarjeta(
    109,
    40,
    "VENCIDAS",
    vencidas,
    [239, 68, 68]
  );

  tarjeta(
    156,
    40,
    "CUMPLIMIENTO",
    `${cumplimiento}%`,
    [234, 179, 8]
  );

  pdf.line(10, 100, 200, 100);

  pdf.setFontSize(13);

  pdf.text(
    "CUMPLIMIENTO GENERAL",
    15,
    75
  );

  pdf.setFillColor(
    245,
    245,
    245
  );

  pdf.roundedRect(
    15,
    80,
    180,
    18,
    3,
    3,
    "F"
  );

  pdf.setFillColor(
    220,
    220,
    220
  );

  pdf.roundedRect(
    25,
    87,
    140,
    6,
    2,
    2,
    "F"
  );

  let colorCumplimiento = [239,68,68];

  if (cumplimientoNumero >= 50)
    colorCumplimiento = [249,115,22];

  if (cumplimientoNumero >= 80)
    colorCumplimiento = [34,197,94];

  pdf.setFillColor(
    colorCumplimiento[0],
    colorCumplimiento[1],
    colorCumplimiento[2]
  );

  pdf.roundedRect(
    25,
    87,
    (140 * cumplimientoNumero) /
      100,
    6,
    2,
    2,
    "F"
  );

  pdf.setFontSize(16);

  pdf.text(
    `${cumplimiento}%`,
    170,
    91
  );

  pdf.setFontSize(9);

  pdf.text(
    "Meta SSOMA: 100%",
    25,
    97
  );

  pdf.setDrawColor(
  180,
  180,
  180
  );

  // jsPDF type definitions may not include setLineDash; cast to any to avoid type error
  (pdf as any).setLineDash([2, 2], 0);

  (pdf as any).setLineDash([2, 2], 0);

  pdf.line(
    10,
    108,
    200,
    108
  );

  (pdf as any).setLineDash([], 0);

  // reset line dash
  (pdf as any).setLineDash([], 0);
  pdf.setFontSize(13);

  pdf.setTextColor(220,38,38);

  pdf.text(
    "ANALISIS DE RIESGOS",
    15,
    115
  );

  pdf.setTextColor(0,0,0);

  pdf.setFontSize(10);

  pdf.setFillColor(34,197,94);

  pdf.rect(20,125,5,5,"F");

  pdf.text(`Bajo: ${bajo}`,30,129);

  pdf.setFillColor(250,204,21);

  pdf.rect(20,135,5,5,"F");

  pdf.text(`Medio: ${medio}`,30,139);

  pdf.setFillColor(249,115,22);

  pdf.rect(20,145,5,5,"F");

  pdf.text(`Alto: ${alto}`,30,149);

  pdf.setFillColor(220,38,38);

  pdf.rect(20,155,5,5,"F");

  pdf.text(`Crítico: ${critico}`,30,159);

  pdf.setDrawColor(180,180,180);

  (pdf as any).setLineDash([2, 2], 0);

  pdf.line(
    10,
    170,
    200,
    170
  );

  (pdf as any).setLineDash([], 0);

  pdf.setFontSize(13);

  pdf.setTextColor(37,99,235);

  pdf.text(
    "DISTRIBUCION POR AREA",
    15,
    180
  );

  pdf.setTextColor(0,0,0);

  const resumenArea = observaciones.reduce(
    (acc: Record<string, number>, item) => {
      acc[item.area] =
        (acc[item.area] || 0) + 1;
      return acc;
    },
    {}
  );

  let y = 190;

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

  (pdf as any).setLineDash([2, 2], 0);

  const yPie = y + 10;

  (pdf as any).setLineDash([2, 2], 0);

  pdf.line(
    10,
    yPie,
    200,
    yPie
  );

 (pdf as any).setLineDash([], 0);

 pdf.setFontSize(8);

  pdf.text(
    "Sistema de Gestión SSOMA",
    15,
    yPie + 7
  );

  pdf.text(
    `Generado: ${new Date().toLocaleString()}`,
    110,
    yPie + 7
  );

  pdf.save(
    `REPORTE_EJECUTIVO_SSOMA.pdf`
  );
}