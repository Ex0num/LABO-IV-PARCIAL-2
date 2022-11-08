import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, doc, Firestore, getDocs, getFirestore, setDoc } from 'firebase/firestore/lite';
import { getStorage } from 'firebase/storage';
import { AuthService } from './Servicios/auth.service';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrOXyIrz9opDCNzOxmd2jea1cEpbmdB-s",
  authDomain: "prisud.firebaseapp.com",
  projectId: "prisud",
  storageBucket: "prisud.appspot.com",
  messagingSenderId: "227191336020",
  appId: "1:227191336020:web:5baa7544239a00298851c1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage();
export const db = getFirestore(app);
export const pacientes = collection(db, "pacientes");
export const especialistas = collection(db, "especialistas");
export const administradores = collection(db, "administradores");
export const turnos = collection(db, "turnos");
export const historiaClinica = collection(db, "historia-clinica");

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent
{
  mailShowed:any = "UserExample@gmail.com";
  isLoged = false;
  isAdmin = false;
  isPaciente = false;
  isEspecialista = false;
  isVerified = false;

  constructor(private router: Router, public srvAuth:AuthService)
  {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => 
    {
      if (user) 
      {
        
        this.srvAuth.obtenerSesion();

        setTimeout(() => {
          this.mailShowed = this.srvAuth.userLogedmail;
          this.isAdmin = this.srvAuth.isAdmin;
          this.isLoged = this.srvAuth.isLoged;
          this.isVerified = this.srvAuth.isVerified;
          this.isPaciente = this.srvAuth.isPacient;
          this.isEspecialista = this.srvAuth.isEspecialist;
  
          console.log("--------------------------");
          console.log("ISLOGED: " + this.isLoged);
          console.log("ISVERIFIED: " + this.isVerified);
          console.log("ISADMIN: " + this.isAdmin);
          console.log("USERLOGEDMAIL: " + this.mailShowed);
          console.log("IS PACIENTE: " + this.isPaciente);
          console.log("IS ESPECIALISTA: " + this.isEspecialista);
          console.log("--------------------------");
        }, 2500);
       
    
      } else 
      {
        //Si el usuario no esta logeado
        console.log("DESLOGEADO!!");
        this.isLoged = false;
        this.isAdmin = false;
        this.mailShowed = "";

      }
    });

    let headerUl = document.getElementById("header-ul");
    let btnLogin = document.getElementById("btnLogin");
    let btnSignUp = document.getElementById("btnSignUp");

    setTimeout(() => 
    {
      headerUl?.removeAttribute("hidden");
      btnLogin?.removeAttribute("hidden");
      btnSignUp?.removeAttribute("hidden");
    }, 2000);    
  }
  
  cerrarSesion()
  {
    this.srvAuth.logOut();
  }

  navigateLogin()
  {
    this.router.navigate(["/login"],);
  }

  navigateRegister()
  {
    this.router.navigate(["/register"],);
  }

}
