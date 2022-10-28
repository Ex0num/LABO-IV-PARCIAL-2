import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { AuthService } from 'src/app/Servicios/auth.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  // -------- VARIABLE DE MOSTRADO DE FORMULARIOS/SPINNER --------
  public cargandoSpinner = false;

  public seleccionandoRegistro = true;
  public registroEspecialista = false;
  public registroPaciente = false;

  // ------------------- VARIABLES PACIENTE ------------------------
  public mailIngresado:any;
  public passwordIngresado:any;
  public passwordConfirmIngresado:any;
  public nombreIngresado:any;
  public apellidoIngresado:any;
  public edadIngresada:any;
  public dniIngresado:any;
  public foto1Ingresada:any;
  public foto2Ingresada:any;

  // ----------------- VARIABLES ESPECIALISTA ----------------------
  public mailEspecialistaIngresado:any;
  public passwordEspecialistaIngresado:any;
  public passwordEspecialistaConfirmIngresado:any;
  public nombreEspecialistaIngresado:any;
  public apellidoEspecialistaIngresado:any;
  public edadEspecialistaIngresada:any;
  public dniEspecialistaIngresado:any;
  public foto1EspecialistaIngresada:any;

  constructor(public routerRecieved:Router, public srvFirebase:FirebaseService, public srvAuth:AuthService) {}
  ngOnInit(): void {}

  // ------------------------ METODOS PACIENTE ---------------------
  async registrarPaciente()
  {
    await this.srvFirebase.subirPacienteDB(this.mailIngresado,this.passwordConfirmIngresado,this.nombreIngresado,this.apellidoIngresado,this.edadIngresada,this.dniIngresado,this.foto1Ingresada,this.foto2Ingresada);
    await this.srvAuth.register(this.mailIngresado,this.passwordIngresado);
   
    await this.limpiarFormPaciente();
    await this.routerRecieved.navigate(["/verificacion-mail"],);

    let usuarioVerificado = await this.srvAuth.isActualSessionVerified();
    if (usuarioVerificado == true)
    {
      this.routerRecieved.navigate(["/verificacion-mail"],);
    }
    else
    {
      this.routerRecieved.navigate(["/verificacion-mail"],);
    }
  }

  fotoPacienteSubida(event:any, numeroFoto:number)
  {
    if (numeroFoto == 1)
    {
      let fileList = event.target.files;
      this.foto1Ingresada = fileList[0];
      console.log(this.foto1Ingresada);
    }
    else
    {
      let fileList = event.target.files;
      this.foto2Ingresada = fileList[0];
      console.log(this.foto2Ingresada);
    }  
  }

  limpiarFormPaciente()
  {
    this.mailIngresado = "";
    this.passwordIngresado = "";
    this.passwordConfirmIngresado = "";
    this.nombreIngresado = "";
    this.apellidoIngresado = "";
    this.edadIngresada = undefined;
    this.dniIngresado = undefined;
    this.foto1Ingresada = undefined;
    this.foto2Ingresada = undefined;
  }

  // ------------------------ METODOS ESPECIALISTA --------------
  async registrarEspecialista()
  {
    let especialidadesArray = await this.formatearEspecialidades();
    console.log(especialidadesArray);

    await this.srvFirebase.subirEspecialistaDB(this.mailEspecialistaIngresado,this.passwordEspecialistaConfirmIngresado,this.nombreEspecialistaIngresado,this.apellidoEspecialistaIngresado,this.edadEspecialistaIngresada,this.dniEspecialistaIngresado,this.foto1EspecialistaIngresada,especialidadesArray);
    await this.srvAuth.register(this.mailEspecialistaIngresado,this.passwordEspecialistaIngresado);

    await this.limpiarFormEspecialista();

    let usuarioVerificado = await this.srvAuth.isActualSessionVerified();
    if (usuarioVerificado == true)
    {
      this.routerRecieved.navigate(["/verificacion-mail"],);
    }
    else
    {
      this.routerRecieved.navigate(["/verificacion-mail"],);
    }
  }

  fotoEspecialistaSubida(event:any)
  {
    let fileList = event.target.files;
    this.foto1EspecialistaIngresada = fileList[0];
    console.log(this.foto1EspecialistaIngresada);
  }

  especialidadesSeleccionadas:string = "";
  especialidadAgregada:string = "";

  actualizarEspecialidades(e:any)
  {    
    if (e.target.checked)
    {
      this.especialidadesSeleccionadas = this.especialidadesSeleccionadas + " " + e.target.value;
    }
    else
    {
      if (this.especialidadesSeleccionadas.includes(e.target.value))
      {
        let arrayLimpiado = this.especialidadesSeleccionadas.replace(" " + e.target.value, "");
        console.log(arrayLimpiado);

        this.especialidadesSeleccionadas = arrayLimpiado;
      };
    }
  }

  agregarEspecialidad()
  {
    if (this.especialidadAgregada != undefined && this.especialidadAgregada != "" && this.especialidadAgregada != null)
    {
      this.especialidadesSeleccionadas = this.especialidadesSeleccionadas + " " +this.especialidadAgregada;
      this.especialidadAgregada = "";
    }
  }

  limpiarEspecialidades()
  {
    this.especialidadesSeleccionadas = "";
    this.especialidadAgregada = "";

    let listadoDeCheckBoxes = document.querySelectorAll(".especialidad-opcion");

    listadoDeCheckBoxes.forEach( (element:any)=> 
    {
      if (element.checked == true)
      {
        element.checked = false;
      }
    })
  }

  formatearEspecialidades()
  {
    let array = this.especialidadesSeleccionadas.split(" ");
    array = array.filter( (a,b)=> {if (a == ""){return b}else{return a}})
    return array;
  } 

  limpiarFormEspecialista()
  {
    this.mailEspecialistaIngresado = "";
    this.passwordEspecialistaIngresado = "";
    this.passwordEspecialistaConfirmIngresado = "";
    this.nombreEspecialistaIngresado = "";
    this.apellidoEspecialistaIngresado = "";
    this.edadEspecialistaIngresada = undefined;
    this.dniEspecialistaIngresado = undefined;
    this.foto1EspecialistaIngresada = undefined;
    this.especialidadesSeleccionadas = "";
    this.limpiarEspecialidades();
  }

  // ------------------------ METODOS MOSTRADO --------------
  mostrarFormEspecialista()
  {
    this.registroEspecialista = false;
    this.seleccionandoRegistro = false;
    this.registroPaciente = false;

    this.cargandoSpinner = true;

    setTimeout( ()=> 
    {
      this.registroEspecialista = true;
      this.cargandoSpinner = false;
    },1500)
    
  }

  mostrarFormPaciente()
  {
    this.registroEspecialista = false;
    this.seleccionandoRegistro = false;
    this.registroPaciente = false;

    this.cargandoSpinner = true;

    setTimeout( ()=> 
    {
      this.registroPaciente = true;
      this.cargandoSpinner = false;
    },1500)
    
  }
  // --------------------------------------------------------
}
