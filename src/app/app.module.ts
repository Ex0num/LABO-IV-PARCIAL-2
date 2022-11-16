import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BienvenidaComponent } from './Vistas/bienvenida/bienvenida.component';
import { LoginComponent } from './Vistas/login/login.component';
import { RegisterComponent } from './Vistas/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VerificacionMailComponent } from './Vistas/verificacion-mail/verificacion-mail.component';
import { UsuariosComponent } from './Vistas/usuarios/usuarios.component';
import { MiPerfilComponent } from './Vistas/mi-perfil/mi-perfil.component';
import { PacientesComponent } from './Vistas/pacientes/pacientes.component';
import { GraficosComponent } from './Vistas/graficos/graficos.component';

@NgModule({
  declarations: [
    AppComponent,
    BienvenidaComponent,
    LoginComponent,
    RegisterComponent,
    VerificacionMailComponent,
    UsuariosComponent,
    MiPerfilComponent,
    PacientesComponent,
    GraficosComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
