import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Servicios/auth.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  constructor(public srvFirebase:FirebaseService, public srvAuth:AuthService, public routerRecieved:Router) {}

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
      botonDelElemento.innerHTML = "☑️";
      this.srvFirebase.setearEstadoCuentaEspecialista(especialista.mail,"habilitado");

      this.listaEspecialistasHabilitadosDB.push(especialistaEstructurado);
      this.listaEspecialistasBloqueadosDB = this.listaEspecialistasBloqueadosDB.filter( (a)=> {if (a.mail == especialista.mail){return 0}else{return -1}});
    }
    else if (botonDelElemento.textContent == "☑️")
    {
      elemento.style.backgroundColor = "#6d5252";
      botonDelElemento.innerHTML = "🚫";
      this.srvFirebase.setearEstadoCuentaEspecialista(especialista.mail,"inhabilitado");

      this.listaEspecialistasBloqueadosDB.push(especialistaEstructurado);
      this.listaEspecialistasHabilitadosDB = this.listaEspecialistasHabilitadosDB.filter( (a)=> {if (a.mail == especialista.mail){return 0}else{return -1}});
  
    }
    
  } 

  cambiarEstadoAltaAdministrador()
  {
    if (this.altaAdminHabilitada == true)
    {
      this.mensajeAltaAdministrador = "Generar nuevo administrador";
      this.altaAdminHabilitada = false;
    }
    else
    {
      this.mensajeAltaAdministrador = "Oculta menú de alta";
      this.altaAdminHabilitada = true;
    }
  }

  public fotoAdminSubida(event:any)
  {
    let fileList = event.target.files;
    this.fotoAdminSubida = fileList[0];
    console.log(this.fotoAdminSubida);
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
}
