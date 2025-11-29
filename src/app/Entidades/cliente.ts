export class Cliente {
  id: string;
  nombres: string;
  apellidos: string;
  cedula: string;
  fechaNacimiento: Date;
  email: string;
  telefono: string;
  direccion: string;
  licenciaConducir: string;
  clienteFrecuente: boolean;

  constructor(
    nombres: string = '',
    apellidos: string = '',
    cedula: string = '',
    fechaNacimiento: Date = new Date(),
    email: string = '',
    telefono: string = '',
    direccion: string = '',
    licenciaConducir: string = '',
    clienteFrecuente: boolean = false,
    id?: string
  ) {
    this.id = id || this.generarId();
    this.nombres = nombres;
    this.apellidos = apellidos;
    this.cedula = cedula;
    this.fechaNacimiento = fechaNacimiento;
    this.email = email;
    this.telefono = telefono;
    this.direccion = direccion;
    this.licenciaConducir = licenciaConducir;
    this.clienteFrecuente = clienteFrecuente;
  }

  private generarId(): string {
    return 'cliente_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  get nombreCompleto(): string {
    return `${this.nombres} ${this.apellidos}`;
  }

  get edad(): number {
    const hoy = new Date();
    const nacimiento = new Date(this.fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  puedeAlquilar(): boolean {
    return this.edad >= 4; // Edad mínima para alquilar cualquier moto
  }

  puedeAlquilarMoto(cilindrada: number): { puede: boolean, razon?: string } {
    const edad = this.edad;

    // 4 a 6 años: solo 50cc
    if (edad >= 4 && edad <= 6) {
      if (cilindrada <= 50) {
        return { puede: true };
      }
      return { puede: false, razon: 'Niños de 4-6 años solo pueden alquilar motos de hasta 50cc (mini motos)' };
    }

    // 7 a 10 años: 50cc - 70cc
    if (edad >= 7 && edad <= 10) {
      if (cilindrada >= 50 && cilindrada <= 70) {
        return { puede: true };
      }
      return { puede: false, razon: 'Niños de 7-10 años solo pueden alquilar motos de 50cc a 70cc' };
    }

    // 11 a 14 años: 70cc - 110cc
    if (edad >= 11 && edad <= 14) {
      if (cilindrada >= 70 && cilindrada <= 110) {
        return { puede: true };
      }
      return { puede: false, razon: 'Adolescentes de 11-14 años solo pueden alquilar motos de 70cc a 110cc' };
    }

    // 15+ años: 125cc o más (con licencia obligatoria)
    if (edad >= 15) {
      if (cilindrada >= 125) {
        if (this.licenciaConducir && this.licenciaConducir.trim() !== '') {
          return { puede: true };
        }
        return { puede: false, razon: 'Para motos de 125cc o más se requiere licencia de conducir' };
      }
      return { puede: false, razon: 'Personas de 15+ años deben alquilar motos de 125cc o más' };
    }

    return { puede: false, razon: 'Edad no válida para alquilar motos' };
  }
}
