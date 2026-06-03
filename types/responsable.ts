export type EstadoResponsable = "Activo" | "Inactivo";

export type Responsable = {
  id: string;
  nombre: string;
  cargo: string;
  area: string;
  celular: string;
  correo: string;
  estado: EstadoResponsable;
  fechaRegistro: string;
};