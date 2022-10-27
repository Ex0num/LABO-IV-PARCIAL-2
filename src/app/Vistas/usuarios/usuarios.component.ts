import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/Servicios/firebase.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  constructor(public srvFirebase:FirebaseService) {}

  listaEspecialistasDB: any[] = [];
  listaEspecialistasBloqueadosDB: any[] = [];
  listaEspecialistasHabilitadosDB: any[] = [];
  listaPacientesDB: any[] = [];

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
  }

  emojiProhibido = "🚫";
  emojiHabilitado = "☑️";
  

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

}
