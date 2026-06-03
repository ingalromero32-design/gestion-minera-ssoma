export type EstadoObservacion =
  | "Pendiente"
  | "En proceso"
  | "Cerrado"
  | "Vencido";

export type NivelRiesgo = "Bajo" | "Medio" | "Alto" | "Crítico";

export type Observacion = {
  id: number;
  fecha: string;
  area: string;
  ubicacion: string;
  tipo: string;
  descripcion: string;
  riesgo: NivelRiesgo;
  responsable: string;
  cargoResponsable?: string;
  celularResponsable: string;
  fechaCompromiso: string;
  estado: EstadoObservacion;

  accionCorrectiva?: string;

  fotoInicial?: string;
  fotoCierre?: string;

  accionCierre?: string;
  fechaCierre?: string;

  latitud?: string;
  longitud?: string;
  enlaceGoogleMaps?: string;
};