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
    
    await setTimeout(async () => {
      
    if (this.srvAuth.isEspecialist == true)
    {
      this.arrayTurnos = await this.srvFirebase.leerTurnosByMailEspecialistaDB(this.srvAuth.userLogedmail);
      this.listadoTurnosEspecialistaLogeado = this.arrayTurnos;
    }
    else
    {
      this.arrayTurnos = await this.srvFirebase.leerTurnosByMailDB(this.srvAuth.userLogedmail);
      this.listadoTurnosPacienteLogeado = this.arrayTurnos;
    }

    console.log(this.arrayTurnos);

    }, 850);
    
  }

  public listadoTurnosEspecialistaLogeado:any[] = [];
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
