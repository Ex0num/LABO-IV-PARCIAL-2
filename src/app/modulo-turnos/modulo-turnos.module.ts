import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TurnosComponent } from './Vistas/turnos/turnos.component';
import { OpcionesFiltradorasTurnosComponent } from './Vistas/turnos/opciones-filtradoras-turnos/opciones-filtradoras-turnos.component';
import { AltaTurnoComponent } from './Vistas/alta-turno/alta-turno.component';



@NgModule({
  declarations: [
    TurnosComponent,
    OpcionesFiltradorasTurnosComponent,
    AltaTurnoComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ModuloTurnosModule { }
