import jsPDF from "jspdf";
import { Observacion } from "@/types/observacion";

export function generarPDFObservacion(
  observacion: Observacion
) {
  const pdf = new jsPDF("p", "mm", "a4");

  pdf.setFontSize(18);
  pdf.text("REPORTE DE OBSERVACIÓN SSOMA", 105, 15, {
    align: "center",
  });

  pdf.setLineWidth(0.5);
  pdf.line(10, 20, 200, 20);

  pdf.setFontSize(10);

  pdf.text(
    `Código: OBS-${observacion.id}`,
    15,
    30
  );

  pdf.text(
    `Fecha: ${new Date(
      observacion.fecha
    ).toLocaleDateString()}`,
    120,
    30
  );

  pdf.text(
    `Estado: ${observacion.estado}`,
    15,
    38
  );

  pdf.text(
    `Riesgo: ${observacion.riesgo}`,
    120,
    38
  );

  pdf.line(10, 45, 200, 45);

  pdf.setFontSize(12);

  pdf.text("DATOS GENERALES", 15, 55);

  pdf.setFontSize(10);

  pdf.text(`Área: ${observacion.area}`, 15, 65);

    pdf.text(
    `Responsable: ${observacion.responsable}`,
    15,
    79
  );

    pdf.text(
    `Cargo: ${observacion.cargoResponsable || "-"}`,
    15,
    86
  );

    pdf.text(
    `Fecha compromiso: ${observacion.fechaCompromiso}`,
    120,
    86
  );

  
    pdf.text(
  `Latitud: ${observacion.latitud || "-"}`,
  15,
  93
  );

  pdf.text(
  `Longitud: ${observacion.longitud || "-"}`,
  120,
  93
  );

  pdf.line(10, 100, 200, 100);   

  pdf.setFontSize(12);

  pdf.text(
    "DESCRIPCIÓN DE LA OBSERVACIÓN",
    15,
    110
  );

  pdf.setFontSize(10);

  const descripcion =
    pdf.splitTextToSize(
      observacion.descripcion,
      180
    );

  pdf.text(descripcion, 15, 120);
  let posicionY = 140;
  if (observacion.fotoInicial) {
  pdf.setFontSize(12);

  pdf.text(
    "EVIDENCIA INICIAL",
    15,
    posicionY
  );

  pdf.addImage(
    observacion.fotoInicial,
    "JPEG",
    15,
    posicionY + 5,
    70,
    50
  );

  posicionY += 65;
}
if (observacion.fotoCierre) {
  pdf.setFontSize(12);

  pdf.text(
    "EVIDENCIA DE CIERRE",
    105,
    posicionY - 65
  );

  pdf.addImage(
    observacion.fotoCierre,
    "JPEG",
    105,
    posicionY - 60,
    70,
    50
  );
}

pdf.setFontSize(12);

pdf.text(
  "INFORMACIÓN DE CIERRE",
  15,
  posicionY + 5
);

pdf.setFontSize(10);

pdf.text(
  `Acción de cierre: ${
    observacion.accionCierre || "Pendiente"
  }`,
  15,
  posicionY + 15
);

pdf.text(
  `Fecha cierre: ${
    observacion.fechaCierre
      ? new Date(observacion.fechaCierre).toLocaleDateString("es-PE")
      : "-"
  }`,
  15,
  posicionY + 23
);

posicionY += 35;

 pdf.line(
  10,
  posicionY,
  200,
  posicionY
);

  pdf.setFontSize(12);

  pdf.text(
  "FIRMAS",
  15,
  posicionY + 18
    );

  const yFirma = posicionY + 45;

    pdf.line(20, yFirma, 70, yFirma);
    pdf.line(80, yFirma, 130, yFirma);
    pdf.line(140, yFirma, 190, yFirma);

pdf.setFontSize(9);

pdf.text(
  "Elaborado por",
  25,
  yFirma + 6
);

pdf.text(
  observacion.responsable,
  18,
  yFirma + 12
);

pdf.text(
  observacion.cargoResponsable || "",
  18,
  yFirma + 17
);

pdf.text(
  "Responsable",
  92,
  yFirma + 6
);

pdf.text(
  observacion.responsable,
  88,
  yFirma + 12
);

pdf.text(
  observacion.cargoResponsable || "",
  88,
  yFirma + 17
);

pdf.text(
  "Supervisor SSOMA",
  145,
  yFirma + 6
);

pdf.text(
  "________________",
  145,
  yFirma + 12
);

pdf.text(
  "Firma y sello",
  148,
  yFirma + 17
);

  pdf.save(
  `REPORTE_SSOMA_OBS-${observacion.id}.pdf`
);
}