import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Servicios/auth.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent implements OnInit {

  constructor(public srvAuth:AuthService, public srvFirebase:FirebaseService) { }

  public historiasClinicasEspecialista: any[] = [];

  async ngOnInit(): Promise<void> 
  {
    this.historiasClinicasEspecialista = await this.srvFirebase.leerTurnosByMailEspecialistaDB(this.srvAuth.userLogedmail);
    
    this.historiasClinicasEspecialista.sort((a,b)=>
    {
      if(a.paciente > b.paciente)
      {
          return 0;
      }
      else
      {
        return -1;
      }
    });

    console.log(this.historiasClinicasEspecialista);
  }

}
