export class Moto {
  id: string;
  marca: string;
  modelo: string;
  anio: number;
  cilindrada: number;
  precioAlquilerDia: number;
  disponible: boolean;
  estado: 'disponible' | 'alquilado' | 'mantenimiento';
  imagen?: string;

  constructor(
    marca: string = '',
    modelo: string = '',
    anio: number = new Date().getFullYear(),
    cilindrada: number = 0,
    precioAlquilerDia: number = 0,
    disponible: boolean = true,
    estado: 'disponible' | 'alquilado' | 'mantenimiento' = 'disponible',
    imagen: string = '',
    id?: string
  ) {
    this.id = id || this.generarId();
    this.marca = marca;
    this.modelo = modelo;
    this.anio = anio;
    this.cilindrada = cilindrada;
    this.precioAlquilerDia = precioAlquilerDia;
    this.disponible = disponible;
    this.estado = estado;
    this.imagen = imagen;
  }

  private generarId(): string {
    return 'moto_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}
