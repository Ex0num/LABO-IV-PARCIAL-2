import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { AuthService } from 'src/app/Servicios/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, public srvAuth:AuthService) { }

  ngOnInit(): void {}

  mailIngresadoLogin:string = "";
  passwordIngresadoLogin:string = "";

  errorShowed:any = "Algo salio mal";

  // private mostrarError(errorRecibido:string)
  // {
  //   let lblerrorMessage = document.getElementById("txtError");
  //   lblerrorMessage?.removeAttribute("hidden");

  //   this.errorShowed = errorRecibido;
  // }

  public logearse()
  {
    this.srvAuth.login(this.mailIngresadoLogin, this.passwordIngresadoLogin);
    this.router.navigate(["/bienvenida"],);
  }

}
