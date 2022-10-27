import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TurnosComponent } from './Vistas/turnos/turnos.component';

const routes: Routes = [
  {path:'misturnos',component:TurnosComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
