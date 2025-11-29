import { Injectable } from '@angular/core';
import { Moto } from '../Entidades/moto';
import { Cliente } from '../Entidades/cliente';
import { Alquiler } from '../Entidades/alquiler';
import { Devolucion } from '../Entidades/devolucion';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly MOTOS_KEY = 'motos';
  private readonly CLIENTES_KEY = 'clientes';
  private readonly ALQUILERES_KEY = 'alquileres';
  private readonly DEVOLUCIONES_KEY = 'devoluciones';

  constructor() {
    this.inicializarDatosPrueba();
  }

  // ==================== MOTOS ====================
  
  getMotos(): Moto[] {
    const data = localStorage.getItem(this.MOTOS_KEY);
    if (!data) return [];
    const motosData = JSON.parse(data);
    return motosData.map((m: any) => Object.assign(new Moto(), m));
  }

  getMotoById(id: string): Moto | undefined {
    const motos = this.getMotos();
    return motos.find(m => m.id === id);
  }

  saveMoto(moto: Moto): void {
    const motos = this.getMotos();
    const index = motos.findIndex(m => m.id === moto.id);
    
    if (index >= 0) {
      motos[index] = moto;
    } else {
      motos.push(moto);
    }
    
    localStorage.setItem(this.MOTOS_KEY, JSON.stringify(motos));
  }

  deleteMoto(id: string): void {
    const motos = this.getMotos();
    const filtered = motos.filter(m => m.id !== id);
    localStorage.setItem(this.MOTOS_KEY, JSON.stringify(filtered));
  }

  getMotosDisponibles(): Moto[] {
    return this.getMotos().filter(m => m.disponible);
  }

  // ==================== CLIENTES ====================
  
  getClientes(): Cliente[] {
    const data = localStorage.getItem(this.CLIENTES_KEY);
    if (!data) return [];
    const clientesData = JSON.parse(data);
    return clientesData.map((c: any) => Object.assign(new Cliente(), c));
  }

  getClienteById(id: string): Cliente | undefined {
    const clientes = this.getClientes();
    return clientes.find(c => c.id === id);
  }

  saveCliente(cliente: Cliente): void {
    const clientes = this.getClientes();
    const index = clientes.findIndex(c => c.id === cliente.id);
    
    if (index >= 0) {
      clientes[index] = cliente;
    } else {
      clientes.push(cliente);
    }
    
    localStorage.setItem(this.CLIENTES_KEY, JSON.stringify(clientes));
  }

  deleteCliente(id: string): void {
    const clientes = this.getClientes();
    const filtered = clientes.filter(c => c.id !== id);
    localStorage.setItem(this.CLIENTES_KEY, JSON.stringify(filtered));
  }

  // ==================== ALQUILERES ====================
  
  getAlquileres(): Alquiler[] {
    const data = localStorage.getItem(this.ALQUILERES_KEY);
    if (!data) return [];
    const alquileresData = JSON.parse(data);
    return alquileresData.map((a: any) => {
      const alquiler = Object.assign(new Alquiler(), a);
      alquiler.fechaInicio = new Date(a.fechaInicio);
      alquiler.fechaTentativaDevolucion = new Date(a.fechaTentativaDevolucion);
      return alquiler;
    });
  }

  getAlquilerById(id: string): Alquiler | undefined {
    const alquileres = this.getAlquileres();
    return alquileres.find(a => a.id === id);
  }

  saveAlquiler(alquiler: Alquiler): void {
    const alquileres = this.getAlquileres();
    const index = alquileres.findIndex(a => a.id === alquiler.id);
    
    if (index >= 0) {
      alquileres[index] = alquiler;
    } else {
      alquileres.push(alquiler);
    }
    
    // Actualizar estado de la moto
    if (alquiler.estado === 'activo') {
      const moto = this.getMotoById(alquiler.motoId);
      if (moto) {
        moto.disponible = false;
        moto.estado = 'alquilado';
        this.saveMoto(moto);
      }
    }
    
    localStorage.setItem(this.ALQUILERES_KEY, JSON.stringify(alquileres));
  }

  deleteAlquiler(id: string): void {
    const alquileres = this.getAlquileres();
    const alquiler = alquileres.find(a => a.id === id);
    
    if (alquiler) {
      // Liberar la moto si el alquiler estaba activo
      if (alquiler.estado === 'activo') {
        const moto = this.getMotoById(alquiler.motoId);
        if (moto) {
          moto.disponible = true;
          this.saveMoto(moto);
        }
      }
    }
    
    const filtered = alquileres.filter(a => a.id !== id);
    localStorage.setItem(this.ALQUILERES_KEY, JSON.stringify(filtered));
  }

  finalizarAlquiler(id: string): void {
    const alquiler = this.getAlquilerById(id);
    if (alquiler) {
      alquiler.estado = 'finalizado';
      const moto = this.getMotoById(alquiler.motoId);
      if (moto) {
        moto.disponible = true;
        moto.estado = 'disponible';
        this.saveMoto(moto);
      }
      this.saveAlquiler(alquiler);
    }
  }

  getAlquileresActivos(): Alquiler[] {
    return this.getAlquileres().filter(a => a.estado === 'activo');
  }

  getAlquileresByCliente(clienteId: string): Alquiler[] {
    return this.getAlquileres().filter(a => a.clienteId === clienteId);
  }

  getAlquileresByMoto(motoId: string): Alquiler[] {
    return this.getAlquileres().filter(a => a.motoId === motoId);
  }

  // ==================== DEVOLUCIONES ====================
  
  getDevoluciones(): Devolucion[] {
    const data = localStorage.getItem(this.DEVOLUCIONES_KEY);
    if (!data) return [];
    const devolucionesData = JSON.parse(data);
    return devolucionesData.map((d: any) => {
      const devolucion = Object.assign(new Devolucion(), d);
      devolucion.fechaDevolucionReal = new Date(d.fechaDevolucionReal);
      return devolucion;
    });
  }

  getDevolucionById(id: string): Devolucion | undefined {
    const devoluciones = this.getDevoluciones();
    return devoluciones.find(d => d.id === id);
  }

  getDevolucionByAlquilerId(alquilerId: string): Devolucion | undefined {
    const devoluciones = this.getDevoluciones();
    return devoluciones.find(d => d.alquilerId === alquilerId);
  }

  saveDevolucion(devolucion: Devolucion): void {
    const devoluciones = this.getDevoluciones();
    const index = devoluciones.findIndex(d => d.id === devolucion.id);
    
    if (index >= 0) {
      devoluciones[index] = devolucion;
    } else {
      devoluciones.push(devolucion);
    }
    
    localStorage.setItem(this.DEVOLUCIONES_KEY, JSON.stringify(devoluciones));
  }

  procesarDevolucion(alquilerId: string, fechaDevolucionReal: Date, observaciones: string = ''): Devolucion {
    const alquiler = this.getAlquilerById(alquilerId);
    if (!alquiler) {
      throw new Error('Alquiler no encontrado');
    }

    const cliente = this.getClienteById(alquiler.clienteId);
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }

    const devolucion = new Devolucion();
    devolucion.alquilerId = alquilerId;
    devolucion.fechaDevolucionReal = fechaDevolucionReal;
    devolucion.observaciones = observaciones;

    // Calcular días de retraso
    const fechaTentativa = new Date(alquiler.fechaTentativaDevolucion).getTime();
    const fechaReal = new Date(fechaDevolucionReal).getTime();
    const diasRetrasoCalc = Math.ceil((fechaReal - fechaTentativa) / (1000 * 60 * 60 * 24));
    devolucion.diasRetraso = diasRetrasoCalc > 0 ? diasRetrasoCalc : 0;

    // Calcular días totales (originales + retraso)
    devolucion.diasTotales = alquiler.diasAlquiler + devolucion.diasRetraso ;

    // RECALCULAR COSTOS con los días totales si hay retraso
    if (devolucion.diasRetraso > 0) {
      // Recalcular importe base con días totales
      devolucion.importeRecalculado = devolucion.diasTotales * alquiler.tarifaDiaria;

      // Calcular multa por retraso: 10% de la tarifa diaria por cada día de retraso
      devolucion.multaPorRetraso = (alquiler.tarifaDiaria * 0.10) * devolucion.diasRetraso;

      // Sumar la multa al importe recalculado
      devolucion.importeRecalculado += devolucion.multaPorRetraso;

      // Recalcular descuento uso extendido (15% si supera 5 días)
      devolucion.descuentoUsoExtendido = devolucion.diasTotales > 5 ? devolucion.importeRecalculado * 0.15 : 0;

      // Calcular el subtotal después del descuento de uso extendido
      const importeDespuesUsoExtendido = devolucion.importeRecalculado - devolucion.descuentoUsoExtendido;

      // Recalcular descuento cliente frecuente (10% sobre el importe después del descuento de uso extendido)
      devolucion.descuentoClienteFrecuente = cliente.clienteFrecuente ? importeDespuesUsoExtendido * 0.10 : 0;

      // Calcular subtotal recalculado
      const totalDescuentos = devolucion.descuentoUsoExtendido + devolucion.descuentoClienteFrecuente;
      
      // Si hay multa (retraso), el depósito recalculado es 0, de lo contrario se calcula el 12%
      if (devolucion.multaPorRetraso > 0) {
        devolucion.depositoRecalculado = 0;
        devolucion.subtotalRecalculado = devolucion.importeRecalculado - totalDescuentos;
      } else {
        devolucion.depositoRecalculado = devolucion.importeRecalculado * 0.12;
        devolucion.subtotalRecalculado = devolucion.importeRecalculado - totalDescuentos + devolucion.depositoRecalculado;
      }

      // Calcular la diferencia entre el subtotal recalculado y el que ya pagó
      const diferenciaPorDiasExtras = devolucion.subtotalRecalculado - alquiler.totalAPagar;

      // Total a pagar = diferencia por días extras - depósito original (que se usa para cubrir)
      const totalDeuda = diferenciaPorDiasExtras;
      
      if (totalDeuda > alquiler.deposito) {
        // El depósito no cubre, cliente debe pagar la diferencia
        devolucion.depositoDevuelto = 0;
        devolucion.totalAPagar = totalDeuda - alquiler.deposito;
      } else {
        // El depósito cubre todo
        devolucion.depositoDevuelto = alquiler.deposito - totalDeuda;
        devolucion.totalAPagar = 0;
      }
    } else {
      // Sin retraso, mantener valores originales
      devolucion.importeRecalculado = alquiler.importe;
      devolucion.descuentoUsoExtendido = alquiler.descuentoUsoExtendido;
      devolucion.descuentoClienteFrecuente = alquiler.descuentoClienteFrecuente;
      devolucion.depositoRecalculado = alquiler.deposito;
      devolucion.subtotalRecalculado = alquiler.totalAPagar;
      devolucion.multaPorRetraso = 0;
      devolucion.depositoDevuelto = alquiler.deposito;
      devolucion.totalAPagar = 0;
    }

    // Guardar devolución
    this.saveDevolucion(devolucion);

    // Finalizar alquiler y liberar moto
    this.finalizarAlquiler(alquilerId);

    return devolucion;
  }

  deleteDevolucion(id: string): void {
    const devoluciones = this.getDevoluciones();
    const filtered = devoluciones.filter(d => d.id !== id);
    localStorage.setItem(this.DEVOLUCIONES_KEY, JSON.stringify(filtered));
  }

  // ==================== CONSULTAS LINQ ====================

  // 1. Clientes que alquilaron más de un vehículo
  getClientesConMultiplesAlquileres(): { cliente: Cliente, cantidadAlquileres: number }[] {
    const clientes = this.getClientes();
    const alquileres = this.getAlquileres();
    
    return clientes
      .map(cliente => ({
        cliente,
        cantidadAlquileres: alquileres.filter(a => a.clienteId === cliente.id).length
      }))
      .filter(item => item.cantidadAlquileres > 1)
      .sort((a, b) => b.cantidadAlquileres - a.cantidadAlquileres);
  }

  // 2. Vehículos más alquilados
  getVehiculosMasAlquilados(): { moto: Moto, cantidadAlquileres: number }[] {
    const motos = this.getMotos();
    const alquileres = this.getAlquileres();
    
    return motos
      .map(moto => ({
        moto,
        cantidadAlquileres: alquileres.filter(a => a.motoId === moto.id).length
      }))
      .filter(item => item.cantidadAlquileres > 0)
      .sort((a, b) => b.cantidadAlquileres - a.cantidadAlquileres);
  }

  // 3. Alquileres con descuento de cliente frecuente y uso extendido
  getAlquileresConDescuentos(): Alquiler[] {
    return this.getAlquileres().filter(a => 
      a.descuentoClienteFrecuente > 0 && a.descuentoUsoExtendido > 0
    );
  }

  // 4. Total recaudado por ECO-MOVE (importe neto + depósitos + multas)
  getTotalRecaudado(): { 
    importeNeto: number, 
    depositos: number, 
    multas: number, 
    total: number 
  } {
    const alquileres = this.getAlquileres();
    const devoluciones = this.getDevoluciones();
    
    const importeNeto = alquileres.reduce((sum, a) => {
      const descuentos = a.descuentoUsoExtendido + a.descuentoClienteFrecuente;
      return sum + (a.importe - descuentos);
    }, 0);
    
    const depositos = alquileres.reduce((sum, a) => sum + a.deposito, 0);
    const multas = devoluciones.reduce((sum, d) => sum + d.multaPorRetraso, 0);
    
    return {
      importeNeto,
      depositos,
      multas,
      total: importeNeto + depositos + multas
    };
  }

  // 5. Clientes que devolvieron tarde y pagaron multa mayor al depósito
  getClientesConMultaMayorAlDeposito(): { 
    cliente: Cliente, 
    alquiler: Alquiler, 
    devolucion: Devolucion 
  }[] {
    const clientes = this.getClientes();
    const alquileres = this.getAlquileres();
    const devoluciones = this.getDevoluciones();
    
    const resultado: any[] = [];
    
    devoluciones
      .filter(d => d.totalAPagar > 0) // Multa superó el depósito
      .forEach(devolucion => {
        const alquiler = alquileres.find(a => a.id === devolucion.alquilerId);
        if (alquiler) {
          const cliente = clientes.find(c => c.id === alquiler.clienteId);
          if (cliente) {
            resultado.push({ cliente, alquiler, devolucion });
          }
        }
      });
    
    return resultado;
  }

  // ==================== UTILIDADES ====================
  
  clearAll(): void {
    localStorage.removeItem(this.MOTOS_KEY);
    localStorage.removeItem(this.CLIENTES_KEY);
    localStorage.removeItem(this.ALQUILERES_KEY);
    localStorage.removeItem(this.DEVOLUCIONES_KEY);
  }

  private inicializarDatosPrueba(): void {
    // Solo inicializar si no hay datos
    if (this.getMotos().length === 0) {
      const motosPrueba = [
        new Moto('Yamaha', 'MT-07', 2023, 689, 25, true, 'disponible', 'https://www.yamahamotos.cl/wp-content/uploads/2018/06/mt07_2025_2.jpg'),
        new Moto('Honda', 'CB500F', 2022, 471, 45, true, 'disponible', 'https://www.honda.es/content/dam/central/motorcycles/colour-picker/street/cb500_hornet/cb500_hornet_2024/nh-436m_matte_gunpowder_black_metallic/2024-CB500-HORNET-MAT-GUNPOWDER-BLACK-METALLIC-Rh-Side.png/_jcr_content/renditions/c2_r.png'),
        new Moto('Kawasaki', 'Ninja 400', 2023, 399, 40, true, 'disponible', 'https://www.motofichas.com/images/cache/01-kawasaki-ninja-400-2023-estudio-verde-398-a-mobile.jpg'),
        new Moto('Suzuki', 'GSX-R750', 2021, 750, 60, true, 'disponible', 'https://i.blogs.es/864f9e/suzuki-gsxr-750-2006/650_1200.jpg'),
        new Moto('KTM', 'Duke 390', 2023, 373, 38, true, 'disponible', 'https://casaexito.com/wp-content/uploads/2022/06/PHO_BIKE_90_RE_390.png')
      ];
      
      motosPrueba.forEach(moto => this.saveMoto(moto));
    }

    if (this.getClientes().length === 0) {
      const clientesPrueba = [
        // Clientes adultos
        new Cliente('Juan', 'Pérez', '1234567890', new Date(1990, 5, 15), 'juan.perez@email.com', '0999888777', 'Av. Principal 123', 'LIC-001', true),
        new Cliente('María', 'González', '0987654321', new Date(1985, 8, 22), 'maria.gonzalez@email.com', '0988777666', 'Calle Secundaria 456', 'LIC-002', false),
        new Cliente('Carlos', 'Ramírez', '1122334455', new Date(1995, 2, 10), 'carlos.ramirez@email.com', '0977666555', 'Jr. Los Sauces 789', 'LIC-003', true),
        
        // Clientes menores de edad (para probar validaciones)
        new Cliente('Sofía', 'Torres', '2222222222', new Date(2020, 3, 10), 'sofia.torres@email.com', '0966555444', 'Calle Luna 456', '', false), // 5 años - 50cc
        new Cliente('Lucas', 'Mendoza', '3333333333', new Date(2016, 7, 20), 'lucas.mendoza@email.com', '0955444333', 'Av. Sol 789', '', false), // 9 años - 50-70cc
        new Cliente('Valentina', 'Castro', '4444444444', new Date(2012, 1, 5), 'valentina.castro@email.com', '0944333222', 'Jr. Estrella 321', '', false), // 13 años - 70-110cc
        new Cliente('Mateo', 'Ruiz', '5555555555', new Date(2008, 9, 15), 'mateo.ruiz@email.com', '0933222111', 'Calle Nube 654', 'LIC-JOVEN-001', false), // 17 años - 125cc+
        new Cliente('Emma', 'Silva', '6666666666', new Date(2010, 4, 25), 'emma.silva@email.com', '0922111000', 'Av. Cielo 987', 'LIC-JOVEN-002', true) // 15 años - 125cc+
      ];
      
      clientesPrueba.forEach(cliente => this.saveCliente(cliente));
    }
  }
}
