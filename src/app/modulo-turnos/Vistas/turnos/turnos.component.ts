import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Servicios/auth.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css']
})
export class TurnosComponent implements OnInit {

  constructor(public srvFirebase:FirebaseService, public srvAuth:AuthService){}

  async ngOnInit(): Promise<void> 
  {
    this.listadoTurnosPacienteLogeado = await this.srvFirebase.leerTurnosByMailDB(this.srvAuth.userLogedmail);
  }

  public listadoTurnosPacienteLogeado:any;

  filtroClickeado(a:any)
  {
    console.log("EVENTO EN EL MAIN RECIBIDO. REEMPLAZANDO.");
    console.log(a);
  }

}
