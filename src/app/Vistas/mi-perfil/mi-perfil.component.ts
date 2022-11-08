import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Servicios/auth.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent implements OnInit {

  constructor(public srvAuth:AuthService, public srvFirebase:FirebaseService) {}

  async ngOnInit() 
  {
    this.usuario = await this.srvFirebase.buscarUsuarioByMail(this.srvAuth.userLogedmail);
    console.log(this.usuario);

    this.userDataLoaded = true;

    if (this.usuario.tipo == 'especialista')
    {
      await this.cargarHorarioLaboral(await this.usuario);
    }

    setTimeout(() => 
    {
      switch (this.usuario.tipo) 
      {
        case 'especialista':
        {
          let dataEspecialista:any = document.getElementById("data-especialista");
          dataEspecialista.style.animation = "slide-in-blurred-left 0.6s cubic-bezier(0.230, 1.000, 0.320, 1.000) both";
          dataEspecialista.removeAttribute("hidden");
          break;
        }
        case 'paciente':
        { 
          let dataPaciente:any = document.getElementById("data-paciente");
          dataPaciente.style.animation = "slide-in-blurred-left 0.6s cubic-bezier(0.230, 1.000, 0.320, 1.000) both";
          dataPaciente.removeAttribute("hidden");
          break;
        }
        case 'administrador':
        {
          let dataAdministrador:any = document.getElementById("data-administrador");
          dataAdministrador.style.animation = "slide-in-blurred-left 0.6s cubic-bezier(0.230, 1.000, 0.320, 1.000) both";
          dataAdministrador.removeAttribute("hidden");  
          break;
        }
      }
      
      let contenedorHistoriaClinicaPaciente:any = document.getElementById("contenedor-absoluto-3");
      contenedorHistoriaClinicaPaciente.style.animation = "slide-in-blurred-left 0.6s cubic-bezier(0.230, 1.000, 0.320, 1.000) both";
      contenedorHistoriaClinicaPaciente.removeAttribute("hidden");  

    }, 1500);
    

    this.historiaClinicaPaciente = await this.srvFirebase.leerTurnosByMailPacienteDB(this.usuario.mail);
    
    this.historiaClinicaPaciente.sort((a,b)=>
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

    console.log(this.historiaClinicaPaciente);
  }

  
  userDataLoaded = false;
  usuario:any;

  mostrarLunes = false;
  mostrarMartes = false;
  mostrarMiercoles = false;
  mostrarJueves = false;
  mostrarViernes = false;
  mostrarSabado = false;

  public listadoHorariosHabilitado = false;
  public mensajeEstadoMostrarHorarios = "Mostrar horarios";

  public historiaClinicaPaciente:any[] = [];

  checkItem(event:any)
  {
    // console.log(event.target);
    // event.target.checked = !event.target.checked;
  }

  checkItemWorking(event:any)
  {
    console.log(event.target);
    event.target.checked = !event.target.checked;
  }

  checkItemNotWorking(event:any)
  {
  }

  autocheckSwitchClickeado()
  {
    if (this.checkItem == this.checkItemNotWorking)
    {
      this.checkItem = this.checkItemWorking;
    }
    else if (this.checkItem == this.checkItemWorking)
    {
      this.checkItem = this.checkItemNotWorking;
    }
    else
    {
      this.checkItem = this.checkItemWorking;
    }
  }

  switchearMostrarColumna(diaASwitchear:string)
  {
      switch (diaASwitchear) 
      {
        case 'lunes':
        {
          this.mostrarLunes = !this.mostrarLunes;
          break;
        }
        case 'martes':
        {
          this.mostrarMartes = !this.mostrarMartes;
          break;
        }
        case 'miercoles':
        {
          this.mostrarMiercoles = !this.mostrarMiercoles;
          break;
        }
        case 'jueves':
        {
          this.mostrarJueves = !this.mostrarJueves;
          break;
        }
        case 'viernes':
        {
          this.mostrarViernes = !this.mostrarViernes;
          break;
        }
        case 'sabado':
        {
          this.mostrarSabado = !this.mostrarSabado;
          break;
        }
      }
  }

  async guardarHorarioLaboral()
  {
    let lunes: any[] = [];
    let martes: any[] = [];
    let miercoles: any[] = [];
    let jueves: any[] = [];
    let viernes: any[] = [];
    let sabado: any[] = [];

    //----------

    let lunesHorarios = document.querySelectorAll('.turno-laboral-lunes');

    lunesHorarios.forEach(element => 
    {
      let variable:any = element;

      if (variable["checked"] == true)
      {
        lunes.push(variable["value"]);
      }
    });

    //-------

    let martesHorarios = document.querySelectorAll('.turno-laboral-martes');

    martesHorarios.forEach(element => 
    {
      let variable:any = element;

      if (variable["checked"] == true)
      {
        martes.push(variable["value"]);
      }
    });

    //-------

    let miercolesHorarios = document.querySelectorAll('.turno-laboral-miercoles');

    miercolesHorarios.forEach(element => 
    {
      let variable:any = element;

      if (variable["checked"] == true)
      {
        miercoles.push(variable["value"]);
      }
    });

    //-------

    let juevesHorarios = document.querySelectorAll('.turno-laboral-jueves');

    juevesHorarios.forEach(element => 
    {
      let variable:any = element;

      if (variable["checked"] == true)
      {
        jueves.push(variable["value"]);
      }
    });

    //-------

    let viernesHorarios = document.querySelectorAll('.turno-laboral-viernes');

    viernesHorarios.forEach(element => 
    {
      let variable:any = element;

      if (variable["checked"] == true)
      {
        viernes.push(variable["value"]);
      }
    });

    //-------

    let sabadoHorarios = document.querySelectorAll('.turno-laboral-sabado');

    sabadoHorarios.forEach(element => 
    {
      let variable:any = element;

      if (variable["checked"] == true)
      {
        sabado.push(variable["value"]);
      }
    });

    //-------

    let especialistaNuevo = 
    {
      mail: this.usuario.mail,
      password: this.usuario.password,
      nombre: this.usuario.nombre,
      apellido: this.usuario.apellido,
      tipo: this.usuario.tipo,
      foto1: this.usuario.foto1,
      estadoCuenta: this.usuario.estadoCuenta,
      especialidades: this.usuario.especialidades,
      edad: this.usuario.edad,
      dni: this.usuario.dni,
      horarioLunes: lunes,
      horarioMartes: martes,
      horarioMiercoles: miercoles,
      horarioJueves: jueves,
      horarioViernes: viernes,
      horarioSabado: sabado,
    }

    let idEspecialista = await this.srvFirebase.obtenerIDEspecialistaPorMail(this.usuario.mail);

    this.srvFirebase.modificarEspecialista(especialistaNuevo,idEspecialista);
  }

  public async cargarHorarioLaboral(usuarioData:any)
  {
    setTimeout(() => 
    {
      if (usuarioData.horarioLunes.length > 0)
      {
        this.mostrarLunes = true;
        let checkMayor:any = document.getElementById("horarios-lunes");
        console.log(checkMayor);
        checkMayor["checked"] = true;

        setTimeout(() => 
        {
          //Por cada horario de lunes lo voy a buscar e ir a chequear en la columna lunes
          let lunesHorarios = document.querySelectorAll('.turno-laboral-lunes');
          console.log(lunesHorarios);

          usuarioData.horarioLunes.forEach( (element:string)=> 
          {      
            console.log(element);

            lunesHorarios.forEach(elementoHTML => 
            {
              let variable:any = elementoHTML;

              if (variable["value"] == element)
              {
                variable["checked"] = true;
              }
            });
        });
        
        }, 500);
        
      }

      if (usuarioData.horarioMartes.length > 0)
      {
        this.mostrarMartes = true;
        let checkMayor:any = document.getElementById("horarios-martes");
        console.log(checkMayor);
        checkMayor["checked"] = true;

        setTimeout(() => 
        {
          //Por cada horario de martes lo voy a buscar e ir a chequear en la columna martes
          let martesHorarios = document.querySelectorAll('.turno-laboral-martes');
          console.log(martesHorarios);

          usuarioData.horarioMartes.forEach( (element:string)=> 
          {      
            console.log(element);

            martesHorarios.forEach(elementoHTML => 
            {
              let variable:any = elementoHTML;

              if (variable["value"] == element)
              {
                variable["checked"] = true;
              }
            });
        });
        }, 500);
      }

      if (usuarioData.horarioMiercoles.length > 0)
      {
        this.mostrarMiercoles = true;
        let checkMayor:any = document.getElementById("horarios-miercoles");
        console.log(checkMayor);
        checkMayor["checked"] = true;

        setTimeout(() => 
        {
          //Por cada horario de miercoles lo voy a buscar e ir a chequear en la columna miercoles
          let miercolesHorarios = document.querySelectorAll('.turno-laboral-miercoles');
          console.log(miercolesHorarios);

          usuarioData.horarioMiercoles.forEach( (element:string)=> 
          {      
            console.log(element);

            miercolesHorarios.forEach(elementoHTML => 
            {
              let variable:any = elementoHTML;

              if (variable["value"] == element)
              {
                variable["checked"] = true;
              }
            });
        });
        }, 500);
      }

      if (usuarioData.horarioJueves.length > 0)
      {
        this.mostrarJueves = true;
        let checkMayor:any = document.getElementById("horarios-jueves");
        console.log(checkMayor);
        checkMayor["checked"] = true;

        setTimeout(() => 
        {
          //Por cada horario de jueves lo voy a buscar e ir a chequear en la columna jueves
          let juevesHorarios = document.querySelectorAll('.turno-laboral-jueves');
          console.log(juevesHorarios);

          usuarioData.horarioJueves.forEach( (element:string)=> 
          {      
            console.log(element);

            juevesHorarios.forEach(elementoHTML => 
            {
              let variable:any = elementoHTML;

              if (variable["value"] == element)
              {
                variable["checked"] = true;
              }
            });
        });
        }, 500);
      }

      if (usuarioData.horarioViernes.length > 0)
      {
        this.mostrarViernes = true;
        let checkMayor:any = document.getElementById("horarios-viernes");
        console.log(checkMayor);
        checkMayor["checked"] = true;

        setTimeout(() => 
        {
          //Por cada horario de viernes lo voy a buscar e ir a chequear en la columna viernes
          let viernesHorarios = document.querySelectorAll('.turno-laboral-viernes');
          console.log(viernesHorarios);

          usuarioData.horarioViernes.forEach( (element:string)=> 
          {      
            console.log(element);

            viernesHorarios.forEach(elementoHTML => 
            {
              let variable:any = elementoHTML;

              if (variable["value"] == element)
              {
                variable["checked"] = true;
              }
            });
        });
        }, 500);
      }

      if (usuarioData.horarioSabado.length > 0)
      {
        this.mostrarSabado = true;
        let checkMayor:any = document.getElementById("horarios-sabado");
        console.log(checkMayor);
        checkMayor["checked"] = true;

        setTimeout(() => 
        {
          //Por cada horario de sabado lo voy a buscar e ir a chequear en la columna sabado
          let sabadoHorarios = document.querySelectorAll('.turno-laboral-sabado');
          console.log(sabadoHorarios);

          usuarioData.horarioSabado.forEach( (element:string)=> 
          {      
            console.log(element);

            sabadoHorarios.forEach(elementoHTML => 
            {
              let variable:any = elementoHTML;

              if (variable["value"] == element)
              {
                variable["checked"] = true;
              }
            });
        });
        }, 500);
      }

      // document.getElementById("row-horarios")?.removeAttribute("hidden");
      document.getElementById("btn-mostrar-horarios")?.removeAttribute("hidden");
    }, 1500);
    
  }

  cambiarEstadoMostrarHorarios()
  {
    if (this.listadoHorariosHabilitado == true)
    {
      let elementoFormAdmin:any = document.getElementById("row-horarios");   
      elementoFormAdmin.style.animation = "scale-out-center 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both";

      setTimeout(() => {
        this.mensajeEstadoMostrarHorarios = "Mostrar horarios";
        this.listadoHorariosHabilitado = false;
        elementoFormAdmin.setAttribute("hidden","true");
      }, 1000);
      
    } 
    else
    {
      this.mensajeEstadoMostrarHorarios = "Ocultar horarios";
      this.listadoHorariosHabilitado = true;
      let elementoFormAdmin:any = document.getElementById("row-horarios");
      

      setTimeout(() => {
        elementoFormAdmin.style.animation = "slide-in-elliptic-top-fwd 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both";
        elementoFormAdmin.removeAttribute("hidden");
      }, 50);
    }
  }
}
