import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Servicios/auth.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';

@Component({
  selector: 'app-alta-turno',
  templateUrl: './alta-turno.component.html',
  styleUrls: ['./alta-turno.component.css']
})
export class AltaTurnoComponent implements OnInit {

  constructor(public srvFirebase:FirebaseService, public srvAuth:AuthService) { }

  async ngOnInit(): Promise<void> 
  {
    this.arrayEspecialistas = await this.srvFirebase.leerEspecialistasDB();
    this.arrayPacientes = await this.srvFirebase.leerPacientesDB();

    let contenedorMain:any = document.getElementById("main-row");
    contenedorMain.removeAttribute("hidden");
    contenedorMain.style.animation = "slide-in-elliptic-left-bck 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both";

    this.usuarioPacienteMailIngresado = this.srvAuth.userLogedmail;
    this.isAdmin = this.srvAuth.isAdmin;
  }

  usuarioPacienteMailIngresado:any;
  especialidadIngresada:any;
  especialistaIngresado:any;
  fechaIngresada:any;
  isAdmin = true;

  arrayEspecialistas: any[] = [];
  arrayEspecialistasFiltrado: any[] = [];
  arrayTurnos:any[] = [];
  arrayPacientes:any[] = [];

  especialidadElegida(valorEmitidoRecibido:any)
  {
    this.especialidadIngresada = valorEmitidoRecibido;
    this.especialistaIngresado = ""; 
    this.fechaIngresada = "";
    let listadoTurnos = document.getElementById("opciones-turnos");
    listadoTurnos?.setAttribute("hidden","true");

    this.arrayEspecialistasFiltrado = this.arrayEspecialistas.filter( (a)=> 
    {
      if (a.especialidades.includes(valorEmitidoRecibido) == true)
      {
        return -1;
      }
      else
      {
        return 0;
      }
    });
  }

  especialistaElegido(especialista:any)
  {
    this.especialistaIngresado = especialista.mail;
    this.generarTurnos(especialista);

    let listadoTurnos = document.getElementById("opciones-turnos");
    listadoTurnos?.setAttribute("hidden","true");

    setTimeout(() => 
    {   
      let listadoTurnos:any = document.getElementById("opciones-turnos");
      listadoTurnos?.removeAttribute("hidden");
  
      listadoTurnos.style.animation = "slide-in-elliptic-top-fwd 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both";
    }, 1000);
    
  }

  generarTurnos(especialista:any)
  {
    // MANEJO DE FECHAS
    let arrayFechasA1Semanas = new Array();
    let arrayFechasA2Semanas = new Array();

    for (let i = 1; i < 8; i++) 
    {
      let fechaActual = new Date();
      fechaActual.setDate(fechaActual.getDate() + i);

      arrayFechasA1Semanas.push(fechaActual);
    }

    for (let i = 8; i < 15; i++) 
    {
      let fechaActual2 = new Date();
      fechaActual2.setDate(fechaActual2.getDate() + i);

      arrayFechasA2Semanas.push(fechaActual2);
    }

    // console.log(arrayFechasA1Semanas);
    // console.log(arrayFechasA2Semanas);
    // -----------------------------

    especialista.horarioLunes.forEach( (horarioDisponible:any) => 
    {
      this.arrayTurnos.push(this.obtenerFechaByDia(true,"Lunes") + " " + horarioDisponible + "hs");
      this.arrayTurnos.push(this.obtenerFechaByDia(false,"Lunes") + " " + horarioDisponible + "hs");
    });

    especialista.horarioMartes.forEach( (horarioDisponible:any) => 
    {
      this.arrayTurnos.push(this.obtenerFechaByDia(true,"Martes") + " " + horarioDisponible + "hs");
      this.arrayTurnos.push(this.obtenerFechaByDia(false,"Martes") + " " + horarioDisponible + "hs");
    });

    especialista.horarioMiercoles.forEach( (horarioDisponible:any) => 
    {
      this.arrayTurnos.push(this.obtenerFechaByDia(true,"Miercoles") + " " + horarioDisponible + "hs");
      this.arrayTurnos.push(this.obtenerFechaByDia(false,"Miercoles") + " " + horarioDisponible + "hs");
    });

    especialista.horarioJueves.forEach( (horarioDisponible:any) => 
    {
      this.arrayTurnos.push(this.obtenerFechaByDia(true,"Jueves") + " " + horarioDisponible + "hs");
      this.arrayTurnos.push(this.obtenerFechaByDia(false,"Jueves") + " " + horarioDisponible + "hs");
    });

    especialista.horarioViernes.forEach( (horarioDisponible:any) => 
    {
      this.arrayTurnos.push(this.obtenerFechaByDia(true,"Viernes") + " " + horarioDisponible + "hs");
      this.arrayTurnos.push(this.obtenerFechaByDia(false,"Viernes") + " " + horarioDisponible + "hs");
    });

    especialista.horarioSabado.forEach( (horarioDisponible:any) => 
    {
      this.arrayTurnos.push(this.obtenerFechaByDia(true,"Sabado") + " " + horarioDisponible + "hs");
      this.arrayTurnos.push(this.obtenerFechaByDia(false,"Sabado") + " " + horarioDisponible + "hs");
    });

    this.arrayTurnos.sort((a,b)=>
    {
      let spliteoA = a.split(" ",2);
      let spliteoB = b.split(" ",2);

      console.log(spliteoA);
      console.log(spliteoB);

      if (spliteoA[1] > spliteoB[1])
      {
        return 0;
      }
      else
      {
        return -1;
      }
    });

    console.log(this.arrayTurnos);

    this.filtrarTurnosNoDisponibles();

  }

  public async filtrarTurnosNoDisponibles()
  {
    let turnosTotalesLeidos = await this.srvFirebase.leerTurnosDB();
    
    turnosTotalesLeidos.forEach((element) => 
    {
      //A todo aquel turno que este en pendiente de ser aceptado o aceptado no se podrá tomar
      if (element.estado == 'pendiente' || element.estado == 'aceptado')
      {
        this.arrayTurnos = this.arrayTurnos.filter((a) =>
        {
          if (a == element.info)
          {
            return 0;
          }
          else
          {
            return 1;
          }
        });
      }
    });
  
    console.log(this.arrayTurnos);
  }

  turnoClickeado(turnoRecibido:any)
  { 
    this.fechaIngresada = turnoRecibido;
  }

  obtenerFechaByDia(primerSemana:boolean, diaABuscar:string)
  {
    let fechaEncontrada;

    if (primerSemana == true)
    {
      let arrayFechasA1Semanas: Date[] = new Array();

      for (let i = 1; i < 8; i++) 
      {
        let fechaActual = new Date();
        fechaActual.setDate(fechaActual.getDate() + i);
  
        arrayFechasA1Semanas.push(fechaActual);
      }

      switch (diaABuscar) 
      {
        case 'Lunes':
        {
          arrayFechasA1Semanas.forEach(element => 
          {
            let stringFecha = element.toString();
            
            if (stringFecha.includes("Mon") == true)
            {
              let fechaSpliteada = stringFecha.split(" ",3);
              console.log(fechaSpliteada);

              fechaEncontrada = "Lunes " + fechaSpliteada[2] + " de " + this.traducirMesIngles(fechaSpliteada[1]);
            }
          }); 

          break;
        }
        case 'Martes':
        {
          arrayFechasA1Semanas.forEach(element => 
          {
            let stringFecha = element.toString();
            
            if (stringFecha.includes("Tue") == true)
            {
              let fechaSpliteada = stringFecha.split(" ",3);
              console.log(fechaSpliteada);

              fechaEncontrada = "Martes " + fechaSpliteada[2] + " de " + this.traducirMesIngles(fechaSpliteada[1]);
            }
          }); 

          break;
        }
        case 'Miercoles':
        {
          arrayFechasA1Semanas.forEach(element => 
          {
            let stringFecha = element.toString();
            
            if (stringFecha.includes("Wed") == true)
            {
              let fechaSpliteada = stringFecha.split(" ",3);
              console.log(fechaSpliteada);

              fechaEncontrada = "Miercoles " + fechaSpliteada[2] + " de " + this.traducirMesIngles(fechaSpliteada[1]);
            }
          }); 

          break;
        }
        case 'Jueves':
        {
          arrayFechasA1Semanas.forEach(element => 
          {
            let stringFecha = element.toString();
            
            if (stringFecha.includes("Thu") == true)
            {
              let fechaSpliteada = stringFecha.split(" ",3);
              console.log(fechaSpliteada);

              fechaEncontrada = "Jueves " + fechaSpliteada[2] + " de " + this.traducirMesIngles(fechaSpliteada[1]);
            }
          }); 

          break;
        }
        case 'Viernes':
        {
          arrayFechasA1Semanas.forEach(element => 
          {
            let stringFecha = element.toString();
            
            if (stringFecha.includes("Fri") == true)
            {
              let fechaSpliteada = stringFecha.split(" ",3);
              console.log(fechaSpliteada);

              fechaEncontrada = "Viernes " + fechaSpliteada[2] + " de " + this.traducirMesIngles(fechaSpliteada[1]);
            }
          }); 

          break;
        }
        case 'Sabado':
        {
          arrayFechasA1Semanas.forEach(element => 
          {
            let stringFecha = element.toString();
            
            if (stringFecha.includes("Sat") == true)
            {
              let fechaSpliteada = stringFecha.split(" ",3);
              console.log(fechaSpliteada);

              fechaEncontrada = "Sabado " + fechaSpliteada[2] + " de " + this.traducirMesIngles(fechaSpliteada[1]);
            }
          }); 

          break;
        }
      }
    }
    else
    {
      let arrayFechasA2Semanas: Date[] = new Array();

      for (let i = 8; i < 15; i++) 
      {
        let fechaActual = new Date();
        fechaActual.setDate(fechaActual.getDate() + i);
  
        arrayFechasA2Semanas.push(fechaActual);
      }

      switch (diaABuscar) 
      {
        case 'Lunes':
        {
          arrayFechasA2Semanas.forEach(element => 
          {
            let stringFecha = element.toString();
            
            if (stringFecha.includes("Mon") == true)
            {
              let fechaSpliteada = stringFecha.split(" ",3);
              console.log(fechaSpliteada);

              fechaEncontrada = "Lunes " + fechaSpliteada[2] + " de " + this.traducirMesIngles(fechaSpliteada[1]);
            }
          }); 

          break;
        }
        case 'Martes':
        {
          arrayFechasA2Semanas.forEach(element => 
          {
            let stringFecha = element.toString();
            
            if (stringFecha.includes("Tue") == true)
            {
              let fechaSpliteada = stringFecha.split(" ",3);
              console.log(fechaSpliteada);

              fechaEncontrada = "Martes " + fechaSpliteada[2] + " de " + this.traducirMesIngles(fechaSpliteada[1]);
            }
          }); 

          break;
        }
        case 'Miercoles':
        {
          arrayFechasA2Semanas.forEach(element => 
          {
            let stringFecha = element.toString();
            
            if (stringFecha.includes("Wed") == true)
            {
              let fechaSpliteada = stringFecha.split(" ",3);
              console.log(fechaSpliteada);

              fechaEncontrada = "Miercoles " + fechaSpliteada[2] + " de " + this.traducirMesIngles(fechaSpliteada[1]);
            }
          }); 

          break;
        }
        case 'Jueves':
        {
          arrayFechasA2Semanas.forEach(element => 
          {
            let stringFecha = element.toString();
            
            if (stringFecha.includes("Thu") == true)
            {
              let fechaSpliteada = stringFecha.split(" ",3);
              console.log(fechaSpliteada);

              fechaEncontrada = "Jueves " + fechaSpliteada[2] + " de " + this.traducirMesIngles(fechaSpliteada[1]);
            }
          }); 

          break;
        }
        case 'Viernes':
        {
          arrayFechasA2Semanas.forEach(element => 
          {
            let stringFecha = element.toString();
            
            if (stringFecha.includes("Fri") == true)
            {
              let fechaSpliteada = stringFecha.split(" ",3);
              console.log(fechaSpliteada);

              fechaEncontrada = "Viernes " + fechaSpliteada[2] + " de " + this.traducirMesIngles(fechaSpliteada[1]);
            }
          }); 

          break;
        }
        case 'Sabado':
        {
          arrayFechasA2Semanas.forEach(element => 
          {
            let stringFecha = element.toString();
            
            if (stringFecha.includes("Sat") == true)
            {
              let fechaSpliteada = stringFecha.split(" ",3);
              console.log(fechaSpliteada);

              fechaEncontrada = "Sabado " + fechaSpliteada[2] + " de " + this.traducirMesIngles(fechaSpliteada[1]);
            }
          }); 

          break;
        }
      }
    }
      
    return fechaEncontrada;
  }

  public traducirMesIngles(mesIngles:string)
  {
    let traduccion;

    switch (mesIngles) 
    {
      case 'Jan':
      {
        traduccion = "Ene";
        break;
      }
      case 'Feb':
      {
        traduccion = "Feb";
        break;
      }
      case 'Mar':
      {
        traduccion = "Mar";
        break;
      }
      case 'Apr':
      {
        traduccion = "Abr";
        break;
      }
      case 'May':
      {
        traduccion = "May";
        break;
      }
      case 'Jun':
      {
        traduccion = "Jun";
        break;
      }
      case 'Jul':
      {
        traduccion = "Jul";
        break;
      }
      case 'Aug':
      {
        traduccion = "Ago";
        break;
      }
      case 'Sep':
      {
        traduccion = "Sep";
        break;
      }
      case 'Oct':
      {
        traduccion = "Oct";
        break;
      }
      case 'Nov':
      {
        traduccion = "Nov";
        break;
      }
      case 'Dec':
      {
        traduccion = "Dic";
        break;
      }
    }

    return traduccion;
  }

  solicitarTurno()
  {
    if (this.especialidadIngresada != "" && this.especialistaIngresado != "" && this.fechaIngresada != "")
    {
      this.srvFirebase.subirTurnoDB(this.especialidadIngresada, this.especialistaIngresado, this.fechaIngresada, this.srvAuth.userLogedmail, undefined);
      
      let contenedorMain:any = document.getElementById("main-row");
      contenedorMain.style.animation = "slide-out-elliptic-left-bck 0.7s ease-in both";
        
      this.especialidadIngresada = "";
      this.especialistaIngresado = "";
      this.fechaIngresada = "";

      let listadoTurnos = document.getElementById("opciones-turnos");
      listadoTurnos?.setAttribute("hidden","true");

      setTimeout(() => 
      {
        let contenedorMain:any = document.getElementById("main-row");
        contenedorMain.style.animation = "slide-in-elliptic-left-fwd 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both";
      }, 1500);
    } 
  }

  pacienteElegido(paciente:any)
  {
    this.usuarioPacienteMailIngresado = paciente.mail;
  }
}
