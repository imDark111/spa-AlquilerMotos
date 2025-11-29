import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Motos } from './Controladores/motos/motos';
import { Clientes } from './Controladores/clientes/clientes';
import { Alquileres } from './Controladores/alquileres/alquileres';
import { Devoluciones } from './Controladores/devoluciones/devoluciones';
import { Consultas } from './Controladores/consultas/consultas';
import { Inicio } from './Controladores/inicio/inicio';

@NgModule({
  declarations: [
    App,
    Motos,
    Clientes,
    Alquileres,
    Devoluciones,
    Consultas,
    Inicio
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
