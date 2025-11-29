import { Component, OnInit } from '@angular/core';
import { Moto } from '../../Entidades/moto';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-motos',
  standalone: false,
  templateUrl: './motos.html',
  styleUrl: './motos.css',
})
export class Motos implements OnInit {
  motos: Moto[] = [];
  motoSeleccionada: Moto | null = null;
  modoEdicion = false;
  modoFormulario = false;

  motoForm: Moto = new Moto();

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.cargarMotos();
  }

  cargarMotos(): void {
    this.motos = this.localStorageService.getMotos();
  }

  nuevaMoto(): void {
    this.motoForm = new Moto();
    this.modoEdicion = false;
    this.modoFormulario = true;
  }

  editarMoto(moto: Moto): void {
    this.motoForm = Object.assign(new Moto(), moto);
    this.modoEdicion = true;
    this.modoFormulario = true;
  }

  guardarMoto(): void {
    if (this.validarFormulario()) {
      this.localStorageService.saveMoto(this.motoForm);
      this.cargarMotos();
      this.cancelarFormulario();
    }
  }

  eliminarMoto(id: string): void {
    if (confirm('¿Está seguro de eliminar esta moto?')) {
      this.localStorageService.deleteMoto(id);
      this.cargarMotos();
    }
  }

  cancelarFormulario(): void {
    this.modoFormulario = false;
    this.motoForm = new Moto();
    this.modoEdicion = false;
  }

  validarFormulario(): boolean {
    return !!(
      this.motoForm.marca &&
      this.motoForm.modelo &&
      this.motoForm.anio > 1900 &&
      this.motoForm.cilindrada > 0 &&
      this.motoForm.precioAlquilerDia > 0
    );
  }

  toggleDisponibilidad(moto: Moto): void {
    moto.disponible = !moto.disponible;
    this.localStorageService.saveMoto(moto);
    this.cargarMotos();
  }
}
