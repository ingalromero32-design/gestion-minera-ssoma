export type EstadoArea = "Activa" | "Inactiva";

export type Area = {
  id: string;
  nombre: string;
  descripcion: string;
  estado: EstadoArea;
  fechaRegistro: string;
};