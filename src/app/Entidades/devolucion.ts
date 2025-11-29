export class Devolucion {
  id: string;
  alquilerId: string;
  fechaDevolucionReal: Date;
  diasRetraso: number;
  diasTotales: number; // Días originales + días de retraso
  importeRecalculado: number; // Importe con los días totales
  descuentoUsoExtendido: number;
  descuentoClienteFrecuente: number;
  depositoRecalculado: number;
  subtotalRecalculado: number;
  multaPorRetraso: number;
  depositoDevuelto: number;
  totalAPagar: number; // Total final a pagar por el cliente
  observaciones?: string;

  constructor(
    alquilerId: string = '',
    fechaDevolucionReal: Date = new Date(),
    diasRetraso: number = 0,
    diasTotales: number = 0,
    importeRecalculado: number = 0,
    descuentoUsoExtendido: number = 0,
    descuentoClienteFrecuente: number = 0,
    depositoRecalculado: number = 0,
    subtotalRecalculado: number = 0,
    multaPorRetraso: number = 0,
    depositoDevuelto: number = 0,
    totalAPagar: number = 0,
    observaciones: string = '',
    id?: string
  ) {
    this.id = id || this.generarId();
    this.alquilerId = alquilerId;
    this.fechaDevolucionReal = fechaDevolucionReal;
    this.diasRetraso = diasRetraso;
    this.diasTotales = diasTotales;
    this.importeRecalculado = importeRecalculado;
    this.descuentoUsoExtendido = descuentoUsoExtendido;
    this.descuentoClienteFrecuente = descuentoClienteFrecuente;
    this.depositoRecalculado = depositoRecalculado;
    this.subtotalRecalculado = subtotalRecalculado;
    this.multaPorRetraso = multaPorRetraso;
    this.depositoDevuelto = depositoDevuelto;
    this.totalAPagar = totalAPagar;
    this.observaciones = observaciones;
  }

  private generarId(): string {
    return 'devolucion_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

}
