import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-inicio',
  standalone: false,
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit {
  totalMotos = 0;
  motosDisponibles = 0;
  totalClientes = 0;
  alquileresActivos = 0;

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    const motos = this.localStorageService.getMotos();
    this.totalMotos = motos.length;
    this.motosDisponibles = motos.filter(m => m.disponible).length;
    
    this.totalClientes = this.localStorageService.getClientes().length;
    this.alquileresActivos = this.localStorageService.getAlquileresActivos().length;
  }

  limpiarDatos(): void {
    if (confirm('¿Estás seguro de limpiar todos los datos? Esta acción no se puede deshacer.')) {
      this.localStorageService.clearAll();
      alert('Datos limpiados correctamente. La página se recargará.');
      window.location.reload();
    }
  }
}
