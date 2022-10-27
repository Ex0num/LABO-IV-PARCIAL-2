import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BienvenidaComponent } from './Vistas/bienvenida/bienvenida.component';
import { LoginComponent } from './Vistas/login/login.component';
import { RegisterComponent } from './Vistas/register/register.component';
import { FormsModule } from '@angular/forms';
import { VerificacionMailComponent } from './Vistas/verificacion-mail/verificacion-mail.component';
import { UsuariosComponent } from './Vistas/usuarios/usuarios.component';

@NgModule({
  declarations: [
    AppComponent,
    BienvenidaComponent,
    LoginComponent,
    RegisterComponent,
    VerificacionMailComponent,
    UsuariosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
