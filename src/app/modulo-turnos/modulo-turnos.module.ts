import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TurnosComponent } from './Vistas/turnos/turnos.component';
import { OpcionesFiltradorasTurnosComponent } from './Vistas/turnos/opciones-filtradoras-turnos/opciones-filtradoras-turnos.component';
import { AltaTurnoComponent } from './Vistas/alta-turno/alta-turno.component';
import { ListadoEspecialidadesComponent } from './Vistas/alta-turno/listado-especialidades/listado-especialidades.component';
import { FormsModule } from '@angular/forms';
import { TotalidadTurnosComponent } from './Vistas/totalidad-turnos/totalidad-turnos.component';


@NgModule({
  declarations: [
    TurnosComponent,
    OpcionesFiltradorasTurnosComponent,
    AltaTurnoComponent,
    ListadoEspecialidadesComponent,
    TotalidadTurnosComponent,
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class ModuloTurnosModule { }
