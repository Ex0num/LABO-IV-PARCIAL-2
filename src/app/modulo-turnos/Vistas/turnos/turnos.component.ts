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
    this.arrayTurnos = await this.srvFirebase.leerTurnosByMailDB(this.srvAuth.userLogedmail);

    // this.arrayTurnos.sort((a,b)=>
    // {
    //   let spliteoA = a.split(" ",2);
    //   let spliteoB = b.split(" ",2);

    //   console.log(spliteoA);
    //   console.log(spliteoB);

    //   if (spliteoA[1] > spliteoB[1])
    //   {
    //     return 0;
    //   }
    //   else
    //   {
    //     return -1;
    //   }
    // });

    this.listadoTurnosPacienteLogeado = this.arrayTurnos;
  }

  public listadoTurnosPacienteLogeado:any[] = [];
  public arrayTurnos:any[] = [];

  filtroClickeado(infoFiltroRecibida:any)
  {
    this.listadoTurnosPacienteLogeado = this.listadoTurnosPacienteLogeado.concat(this.arrayTurnos);

    if (infoFiltroRecibida.tipo == 'especialista')
    {
      this.listadoTurnosPacienteLogeado = this.arrayTurnos.filter( (e:any) => 
      {
          if (e.especialista == infoFiltroRecibida.data.mail)
          {
            return -1;
          }
          else
          {
            return 0;
          }
      });

      console.log(infoFiltroRecibida.data);
    }
    else if (infoFiltroRecibida.tipo == 'especialidad')
    {
      this.listadoTurnosPacienteLogeado = this.arrayTurnos.filter( (e:any) => 
      {
          if (e.especialidad == infoFiltroRecibida.data)
          {
            return -1;
          }
          else
          {
            return 0;
          }
      });
    }
    else if (infoFiltroRecibida.tipo == 'default')
    { 
      this.listadoTurnosPacienteLogeado = this.arrayTurnos;
    }

    console.log(this.listadoTurnosPacienteLogeado);
  }

  public turnoSeleccionado = false;
  public turnoDataActual:any;
  public estadoTurno = "none";
  public resenaTurno = "none";

  comentarioTurnoHabilitado = false;

  resenaTurnoHabilitado = false;
  textoResena = "";
  comentarioIngresado = "";

  turnoClickeado(turnoRecibido:any)
  {
    this.resenaTurnoHabilitado = false;
    this.comentarioTurnoHabilitado = false;
    this.turnoSeleccionado = true;
    this.turnoDataActual = turnoRecibido;
    this.estadoTurno = turnoRecibido.estado;
    this.resenaTurno = turnoRecibido.resena;
    console.log(turnoRecibido);

  }

  cancelarTurno()
  {
    this.comentarioTurnoHabilitado = true;
  }

  procederCancelacion()
  {
    this.srvFirebase.setearEstadoyComentarioTurno(this.turnoDataActual.info, this.turnoDataActual.estado, "cancelado", this.comentarioIngresado);
  }

  verResena()
  {
    this.textoResena = this.turnoDataActual.resena;
    this.resenaTurnoHabilitado = true;
  }

  enviarEncuesta()
  {

  }

}
