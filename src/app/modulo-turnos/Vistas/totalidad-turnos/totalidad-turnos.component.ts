import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Servicios/auth.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';

@Component({
  selector: 'app-totalidad-turnos',
  templateUrl: './totalidad-turnos.component.html',
  styleUrls: ['./totalidad-turnos.component.css']
})
export class TotalidadTurnosComponent implements OnInit {

  constructor(public srvFirebase:FirebaseService, public srvAuth:AuthService){}

  async ngOnInit(): Promise<void> {

    this.arrayTurnos = await this.srvFirebase.leerTurnosDB();
    this.listadoTurnosTotal = this.arrayTurnos;
  }

  public listadoTurnosTotal:any[] = [];
  public arrayTurnos:any[] = [];

  public turnoSeleccionado = false;
  public turnoDataActual:any;
  public estadoTurno = "none";
  public resenaTurno = "none";

  comentarioTurnoHabilitado = false;
  comentarioIngresado = "";

  turnoClickeado(turnoRecibido:any)
  {
    this.turnoSeleccionado = true;
    this.turnoDataActual = turnoRecibido;
    this.estadoTurno = turnoRecibido.estado;
    this.resenaTurno = turnoRecibido.resena;
    console.log(turnoRecibido);
  }

  filtroClickeado(infoFiltroRecibida:any)
  {
    if (infoFiltroRecibida.tipo == 'especialista')
    {
      this.listadoTurnosTotal = this.listadoTurnosTotal.filter( (e:any) => 
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
      this.listadoTurnosTotal = this.arrayTurnos.filter( (e:any) => 
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
      this.listadoTurnosTotal = this.arrayTurnos;
    }

    console.log(this.listadoTurnosTotal);
  }

  cancelarTurno()
  {
    this.comentarioTurnoHabilitado = true;
  }

  procederCancelacion()
  {
    this.srvFirebase.setearEstadoyComentarioTurno(this.turnoDataActual.info, this.turnoDataActual.estado, "cancelado", this.comentarioIngresado);
  }

}
