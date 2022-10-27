import { Component, OnInit } from '@angular/core';
import { getAuth, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth';
import { AuthService } from 'src/app/Servicios/auth.service';

@Component({
  selector: 'app-verificacion-mail',
  templateUrl: './verificacion-mail.component.html',
  styleUrls: ['./verificacion-mail.component.css']
})
export class VerificacionMailComponent implements OnInit {

  constructor(public srvAuth:AuthService){}

  ngOnInit() 
  {
    this.isLoged = this.srvAuth.isLoged;
    this.isVerified = this.srvAuth.isVerified;
    this.mailLoged = this.srvAuth.userLogedmail;
  }

  isLoged:any = true;
  isVerified:any = false;
  mailLoged:any = "";

  async enviarVerificacionMail(): Promise<void> 
  {
    this.srvAuth.enviarMailVerificacion();
  }

}
