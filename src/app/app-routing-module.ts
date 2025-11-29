import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Inicio } from './Controladores/inicio/inicio';
import { Motos } from './Controladores/motos/motos';
import { Clientes } from './Controladores/clientes/clientes';
import { Alquileres } from './Controladores/alquileres/alquileres';
import { Devoluciones } from './Controladores/devoluciones/devoluciones';
import { Consultas } from './Controladores/consultas/consultas';

const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio', component: Inicio },
  { path: 'motos', component: Motos },
  { path: 'clientes', component: Clientes },
  { path: 'alquileres', component: Alquileres },
  { path: 'devoluciones', component: Devoluciones },
  { path: 'consultas', component: Consultas },
  { path: '**', redirectTo: '/inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
