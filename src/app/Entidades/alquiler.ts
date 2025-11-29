export class Alquiler {
  id: string;
  clienteId: string;
  motoId: string;
  fechaInicio: Date;
  fechaTentativaDevolucion: Date;
  diasAlquiler: number;
  tarifaDiaria: number;
  importe: number;
  descuentoUsoExtendido: number;
  descuentoClienteFrecuente: number;
  deposito: number;
  totalAPagar: number;
  estado: 'activo' | 'finalizado' | 'cancelado';
  observaciones?: string;

  constructor(
    clienteId: string = '',
    motoId: string = '',
    fechaInicio: Date = new Date(),
    fechaTentativaDevolucion: Date = new Date(),
    diasAlquiler: number = 0,
    tarifaDiaria: number = 0,
    importe: number = 0,
    descuentoUsoExtendido: number = 0,
    descuentoClienteFrecuente: number = 0,
    deposito: number = 0,
    totalAPagar: number = 0,
    estado: 'activo' | 'finalizado' | 'cancelado' = 'activo',
    observaciones: string = '',
    id?: string
  ) {
    this.id = id || this.generarId();
    this.clienteId = clienteId;
    this.motoId = motoId;
    this.fechaInicio = fechaInicio;
    this.fechaTentativaDevolucion = fechaTentativaDevolucion;
    this.diasAlquiler = diasAlquiler;
    this.tarifaDiaria = tarifaDiaria;
    this.importe = importe;
    this.descuentoUsoExtendido = descuentoUsoExtendido;
    this.descuentoClienteFrecuente = descuentoClienteFrecuente;
    this.deposito = deposito;
    this.totalAPagar = totalAPagar;
    this.estado = estado;
    this.observaciones = observaciones;
  }

  private generarId(): string {
    return 'alquiler_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  calcularDias(): number {
    // Normalizar fechas a medianoche para evitar problemas de zona horaria
    const inicio = new Date(this.fechaInicio);
    inicio.setHours(0, 0, 0, 0);
    
    const fin = new Date(this.fechaTentativaDevolucion);
    fin.setHours(0, 0, 0, 0);
    
    const dias = Math.round((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
    return dias > 0 ? dias : 1;
  }

  calcularCostos(tarifaDiaria: number, esClienteFrecuente: boolean): void {
    this.diasAlquiler = this.calcularDias();
    this.tarifaDiaria = tarifaDiaria;
    this.importe = this.diasAlquiler * tarifaDiaria;

     // Descuento por uso extendido (15% si supera 5 días)
this.descuentoUsoExtendido = this.diasAlquiler > 5 ? this.importe * 0.15 : 0;

    const subtotal = this.importe - this.descuentoUsoExtendido;


// Descuento cliente frecuente (10% adicional)
this.descuentoClienteFrecuente = esClienteFrecuente ? subtotal * 0.10 : 0;


// Depósito (12% sobre el subtotal)
this.deposito = this.importe * 0.12;

// 🔹 TOTAL A PAGAR = Importe − descuentos - depósito
this.totalAPagar = this.importe 
                   - this.descuentoUsoExtendido 
                   - this.descuentoClienteFrecuente 
                   - this.deposito;

  }
}
