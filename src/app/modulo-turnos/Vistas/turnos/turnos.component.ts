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

      this.arrayPacientes = await this.srvFirebase.leerPacientesDB();
      this.arrayEspecialidades =  await this.srvFirebase.leerEspecialidades();
    }
    else
    {
      this.arrayTurnos = await this.srvFirebase.leerTurnosByMailDB(this.srvAuth.userLogedmail);
      this.listadoTurnosPacienteLogeado = this.arrayTurnos;
    }

    console.log(this.arrayTurnos);

    }, 850);
    
  }

  actualizarFiltracionCampo(event:any)
  {
    this.campoFiltrador = event.target.value;
  }

  public listadoTurnosEspecialistaLogeado:any[] = [];
  public listadoTurnosPacienteLogeado:any[] = [];
  public arrayTurnos:any[] = [];

  public probandoPipe:any;

  public datoFiltrador:any;
  public campoFiltrador:any;

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

  valoracionTurnoHabilitado = false;
  valoracionIngresada = "";

  encuestaTurnoHabilitado = false;
  encuestaIngresada = "";

  comentarioTurnoHabilitado = false;
  comentarioIngresado = "";

  resenaDevolucionTurnoHabilitado = false;
  textoDevolucion = "";

  resenaTurnoHabilitado = false;
  textoResena = "";

  //Datos de historia clinica (cargada al finalizar turno)
  public alturaPaciente:any;
  public pesoPaciente:any;
  public temperaturaPaciente:any;
  public presionPaciente:any;

  public datoPersonalizadoPaciente:string = "";
  public valorPersonalizadoPaciente:string = "";

  turnoClickeado(turnoRecibido:any)
  {
    this.resenaTurnoHabilitado = false;
    this.resenaDevolucionTurnoHabilitado = false;
    this.comentarioTurnoHabilitado = false;
    this.encuestaTurnoHabilitado = false;
    this.valoracionTurnoHabilitado = false;

    this.turnoSeleccionado = true;
    this.turnoDataActual = turnoRecibido;
    this.estadoTurno = turnoRecibido.estado;
    this.resenaTurno = turnoRecibido.resena;
    console.log(turnoRecibido);

  }

  enviarValoracion()
  {
    this.valoracionTurnoHabilitado = true;
  }

  procederValoracion()
  {
    this.srvFirebase.setearEstadoyValoracionTurno(this.turnoDataActual.info, this.turnoDataActual.estado, this.turnoDataActual.estado, this.valoracionIngresada);
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
    this.encuestaTurnoHabilitado = true;
  }

  procederEncuesta()
  {
    this.srvFirebase.setearEstadoyEncuestaTurno(this.turnoDataActual.info, this.turnoDataActual.estado, this.turnoDataActual.estado, this.encuestaIngresada);
  }

  aceptarTurno()
  {
    this.srvFirebase.setearEstadoyComentarioTurno(this.turnoDataActual.info, this.turnoDataActual.estado, "aceptado", this.turnoDataActual.comentario);
  }

  rechazarTurno()
  {
    this.srvFirebase.setearEstadoyComentarioTurno(this.turnoDataActual.info, this.turnoDataActual.estado, "rechazado", this.turnoDataActual.comentario);
  }

  finalizarTurno()
  {
    this.resenaDevolucionTurnoHabilitado = true;
  }

  procederFinalizacion()
  {
    this.srvFirebase.setearEstadoResenaHistoriaTurno(
      this.turnoDataActual.info, 
      this.turnoDataActual.estado, 
      "realizado", 
      this.textoDevolucion,

      this.alturaPaciente,
      this.pesoPaciente,
      this.temperaturaPaciente,
      this.presionPaciente,
      this.datoPersonalizadoPaciente,
      this.valorPersonalizadoPaciente);
  }

  // FILTRACIONES

  opcionFiltradoraSeleccionada = 'none';

  arrayPacientes:any;
  arrayEspecialidades:any;

  filtroClickeadoEspecialista(dataRecibida:any, tipoRecibido:any)
  {
    this.listadoTurnosEspecialistaLogeado = this.listadoTurnosEspecialistaLogeado.concat(this.arrayTurnos);

    let infoFiltroRecibida = 
    {
      tipo: tipoRecibido, 
      data: dataRecibida
    };

    if (infoFiltroRecibida.tipo == 'paciente')
    {
      this.listadoTurnosEspecialistaLogeado = this.arrayTurnos.filter( (e:any) => 
      {
          if (e.paciente == infoFiltroRecibida.data.mail)
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
      this.listadoTurnosEspecialistaLogeado = this.arrayTurnos.filter( (e:any) => 
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
      this.listadoTurnosEspecialistaLogeado = this.arrayTurnos;
    }

    console.log(this.listadoTurnosPacienteLogeado);
  }

  actualizarFiltroEspecialista(filtracionRecibida:string)
  {
    let btnPaciente:any = document.getElementById("btn-filtro-paciente");
    let btnEspecialidad:any = document.getElementById("btn-filtro-especialidad");

    switch (filtracionRecibida) 
    {
      case 'paciente':
      {
        btnPaciente.style.backgroundColor = "#556e78";
        btnEspecialidad.style.backgroundColor = "#425b65";
        this.opcionFiltradoraSeleccionada = filtracionRecibida;
        
        break;
      }
      case 'especialidad':
      {
        btnEspecialidad.style.backgroundColor = "#556e78";
        btnPaciente.style.backgroundColor = "#425b65";
        this.opcionFiltradoraSeleccionada = filtracionRecibida;

        break;
      }
    }
  }

  // --

  actualizarFiltro(filtracionRecibida:string)
  {
    let btnEspecialista:any = document.getElementById("btn-filtro-especialista");
    let btnEspecialidad:any = document.getElementById("btn-filtro-especialidad");

    switch (filtracionRecibida) 
    {
      case 'especialista':
      {
        btnEspecialista.style.backgroundColor = "#556e78";
        btnEspecialidad.style.backgroundColor = "#425b65";
        this.opcionFiltradoraSeleccionada = filtracionRecibida;
        
        break;
      }
      case 'especialidad':
      {
        btnEspecialidad.style.backgroundColor = "#556e78";
        btnEspecialista.style.backgroundColor = "#425b65";
        this.opcionFiltradoraSeleccionada = filtracionRecibida;

        break;
      }
    }

    
  }

}
