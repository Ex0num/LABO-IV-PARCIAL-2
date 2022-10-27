import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnlyAdminGuard } from './Guardianes/only-admin.guard';
import { OnlyNotVerifiedMailGuard } from './Guardianes/only-not-verified-mail.guard';
import { TurnosComponent } from './modulo-turnos/Vistas/turnos/turnos.component';
import { BienvenidaComponent } from './Vistas/bienvenida/bienvenida.component';
import { LoginComponent } from './Vistas/login/login.component';
import { RegisterComponent } from './Vistas/register/register.component';
import { UsuariosComponent } from './Vistas/usuarios/usuarios.component';
import { VerificacionMailComponent } from './Vistas/verificacion-mail/verificacion-mail.component';

const routes: Routes = [
  {path:'bienvenida',component:BienvenidaComponent},
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'verificacion-mail',component:VerificacionMailComponent},
  {path:'usuarios',component:UsuariosComponent, canActivate: [OnlyAdminGuard]},
  {path:'misturnos',component:TurnosComponent, loadChildren: () => import('./modulo-turnos/modulo-turnos.module').then(m => m.ModuloTurnosModule)},
  {path: '', component:BienvenidaComponent},
  {path:'**',component:BienvenidaComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
