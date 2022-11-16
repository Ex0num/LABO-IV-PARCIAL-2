import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Servicios/auth.service';
import { ExcelExportService } from 'src/app/Servicios/excel-export.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  constructor(public srvFirebase:FirebaseService, public srvAuth:AuthService, public routerRecieved:Router,public srvExcel:ExcelExportService) 
  {}

  listaEspecialistasDB: any[] = [];
  listaEspecialistasBloqueadosDB: any[] = [];
  listaEspecialistasHabilitadosDB: any[] = [];
  listaPacientesDB: any[] = [];

  emojiProhibido = "🚫";
  emojiHabilitado = "☑️";

  public cargandoSpinner = true;

  public altaAdminHabilitada = false;
  public mensajeAltaAdministrador = "Generar nuevo administrador";

  public mailAdminIngresado:any;
  public passwordAdminIngresado:any;
  public passwordAdminConfirmIngresado:any;
  public nombreAdminIngresado:any;
  public apellidoAdminIngresado:any;
  public edadAdminIngresada:any;
  public dniAdminIngresado:any;
  public fotoAdminIngresada:any;

  public historiasClinicas: any[] = [];

  async ngOnInit(): Promise<void> 
  {
    this.listaEspecialistasDB = await this.srvFirebase.leerEspecialistasDB();
    this.listaEspecialistasHabilitadosDB = this.listaEspecialistasDB.filter( (a)=>{if(a.estadoCuenta == "habilitado"){return -1}else{return 0}});
    this.listaEspecialistasBloqueadosDB = this.listaEspecialistasDB.filter( (a)=>{if(a.estadoCuenta == "inhabilitado"){return -1}else{return 0}});
    
    this.listaPacientesDB = await this.srvFirebase.leerPacientesDB();

    console.log("Especialistas TOTALES:");
    console.log(this.listaEspecialistasDB);

    console.log("Especialistas BLOQUEADOS:");
    console.log(this.listaEspecialistasBloqueadosDB);

    console.log("Especialistas HABILITADOS:");
    console.log(this.listaEspecialistasHabilitadosDB);

    setTimeout( ()=> 
    {
      this.cargandoSpinner = false;
    },2000)

    this.historiasClinicas = await this.srvFirebase.leerTurnosDB();
  
    this.historiasClinicas.sort((a,b)=>
    {
      if(a.especialista > b.especialista)
      {
          return 0;
      }
      else
      {
        return -1;
      }
    });

    console.log(this.historiasClinicas);

  }

  cambiarEstadoEspecialista(e:any, especialista:any)
  {

    //Elemento
    let especialistaEstructurado = 
    {
      mail: especialista.mail,
      password: especialista.password,
      nombre: especialista.nombre,
      apellido: especialista.apellido,
      edad: especialista.edad,
      dni: especialista.dni,
      foto1: especialista.foto1,
      especialidades: especialista.especialidades,
      estadoCuenta: especialista.estadoCuenta
    };

    let botonDelElemento:HTMLElement = e.target;
    let elemento:HTMLElement = e.target.parentElement?.parentElement?.parentElement;

    //Me fijo en que estado esta el usuario
    if (botonDelElemento.textContent == "🚫")
    {
      elemento.style.backgroundColor = "#425b65";
      elemento.style.animation = "scale-out-center 0.3s cubic-bezier(0.550, 0.085, 0.680, 0.530) both";
      botonDelElemento.innerHTML = "☑️";

      setTimeout(() => 
      {
        this.srvFirebase.setearEstadoCuentaEspecialista(especialista.mail,"habilitado");  
        this.listaEspecialistasHabilitadosDB.push(especialistaEstructurado);
        this.listaEspecialistasBloqueadosDB = this.listaEspecialistasBloqueadosDB.filter( (a)=> {if (a.mail == especialista.mail){return 0}else{return -1}});
      },1000);
    }
    else if (botonDelElemento.textContent == "☑️")
    {
      elemento.style.backgroundColor = "#6d5252";
      elemento.style.animation = "scale-out-center 0.1s cubic-bezier(0.550, 0.085, 0.680, 0.530) both";
      botonDelElemento.innerHTML = "🚫";

      setTimeout(() => 
      {
        this.srvFirebase.setearEstadoCuentaEspecialista(especialista.mail,"inhabilitado");
        this.listaEspecialistasBloqueadosDB.push(especialistaEstructurado);
        this.listaEspecialistasHabilitadosDB = this.listaEspecialistasHabilitadosDB.filter( (a)=> {if (a.mail == especialista.mail){return 0}else{return -1}});
      }, 1000);
    }
  } 

  cambiarEstadoAltaAdministrador()
  {
    if (this.altaAdminHabilitada == true)
    {
      let elementoFormAdmin:any = document.getElementById("seccion-form-administrador");
      elementoFormAdmin.style.animation = "scale-out-center 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both";

      setTimeout(() => {
        this.mensajeAltaAdministrador = "Generar nuevo administrador";
        this.altaAdminHabilitada = false;
      }, 1000);
      
    }
    else
    {
      this.mensajeAltaAdministrador = "Oculta menú de alta";
      this.altaAdminHabilitada = true;

      setTimeout(() => {
        let elementoFormAdmin:any = document.getElementById("seccion-form-administrador");
        elementoFormAdmin.style.animation = "slide-in-elliptic-top-fwd 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both";
      }, 50);
    }
  }

  public fotoAdminSubida(event:any)
  {
    let fileList = event.target.files;
    this.fotoAdminIngresada = fileList[0];
    console.log(this.fotoAdminIngresada);
  }

  public registrarAdmin()
  {
    this.srvFirebase.subirAdministradorDB(this.mailAdminIngresado,this.passwordAdminIngresado,this.nombreAdminIngresado,this.apellidoAdminIngresado,this.edadAdminIngresada,this.dniAdminIngresado,this.fotoAdminIngresada);
    this.srvAuth.register(this.mailAdminIngresado,this.passwordAdminIngresado);
    this.routerRecieved.navigate(['/verificacion-mail']);
    this.cambiarEstadoAltaAdministrador();
    this.mailAdminIngresado = "";
    this.limpiarControles();
  }

  private limpiarControles()
  {
    this.mailAdminIngresado = "";
    this.passwordAdminIngresado = "";
    this.passwordAdminConfirmIngresado = "";
    this.nombreAdminIngresado = "";
    this.apellidoAdminIngresado = "";
    this.dniAdminIngresado = undefined;
    this.fotoAdminIngresada = undefined;
  }

  public async exportexcel()
  {
    let arrayUsuarios = await this.srvFirebase.leerPacientesDB();
    arrayUsuarios.concat(await this.srvFirebase.leerEspecialistasDB());
    arrayUsuarios.concat(await this.srvFirebase.leerAdministradoresDB());

    this.srvExcel.exportar_ArrayObjetos_toExcel(arrayUsuarios,"Usuarios-total","Hoja 1");
  }

  public async descargarDataPacienteClickeado(pacienteClickeado:any)
  {
    let arrayTurnos = await this.srvFirebase.leerTurnosDB(); 
    let arrayTurnosDelPaciente:any = [];

    arrayTurnos.forEach( (turno) => 
    {
      if (turno.paciente == pacienteClickeado.mail)
      {
        arrayTurnosDelPaciente.push(turno);
      }
    });

    let fechaValidaActual = new Date().toLocaleDateString();
    do { fechaValidaActual = fechaValidaActual.replace("/","-"); } while(fechaValidaActual.includes("/"));

    let tituloExcel = pacienteClickeado.nombre + " " + pacienteClickeado.apellido + " Historia clinica al " + fechaValidaActual;

    this.srvExcel.exportar_ArrayObjetos_toExcel(arrayTurnosDelPaciente,tituloExcel,"Hoja 1");
  }
}
