import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendEmailVerification} from 'firebase/auth';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoged:any;
  isVerified:any;
  userLogedmail: any | undefined;
  isAdmin:any;

  userLogedData:any

  constructor(private router: Router, public srvFirebase:FirebaseService)
  {
    this.obtenerSesion();
  }

  public login(mailRecibido:string, passwordRecibida:string)
  {
    const auth = getAuth();
    
    signInWithEmailAndPassword(auth, mailRecibido, passwordRecibida).then(async (userCredential) =>
     {

      console.log("El inicio de sesión fue satisfactorio. Bienvenido/a.");
      // this.mostrarSatisfaccion("El inicio de sesión fue satisfactorio. Bienvenido/a.");

      // Signed in
      const userLoged = userCredential.user;
      this.isLoged = true;
      this.userLogedmail = userLoged.email;
      this.isAdmin = await this.isAdministrador(userLoged.email);

      console.log("--------------------------");
      console.log("ISLOGED: " + this.isLoged);
      console.log("ISVERIFIED: " + this.isVerified);
      console.log("ISADMIN: " + this.isAdmin);
      console.log("USERLOGEDMAIL: " + this.userLogedmail);
      console.log("--------------------------");
        
      }).catch((error) => {console.log(error.code);});
  }

  public logOut()
  {
    const auth = getAuth();
    signOut(auth).then(() => 
    {
      // Sign-out successful.
      console.log("--------------------------");
      console.log("Cierre de sesión satisfactorio. Vuelva prontosss!");
      console.log("--------------------------");

      this.userLogedmail = undefined;
      this.router.navigate(['/bienvenido']);

    }).catch((error) => 
    {
      // An error happened.
      console.log(error);
    });
  }

  public obtenerSesion()
  {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => 
    {
      if (user) 
      {
        //Setteos de parametros
        this.isLoged = true;
        this.userLogedmail = user.email;

        this.isAdmin = this.isAdministrador(user.email);

        if (user.emailVerified == true)
        { this.isVerified = true;} 
        else 
        { this.isVerified = false;} 

        this.userLogedData = user;
   
      } 
      else 
      {
        //Si el usuario no esta logeado
        this.isLoged = false;
        this.userLogedmail = undefined;
        this.isAdmin = false;
        this.isVerified = false;
      }
    });
    
    let sessionData = 
    {
      isLoged: this.isLoged,
      isVerified: this.isVerified,
      isAdmin: this.isAdmin,
      userLogedmail: this.userLogedmail
    };

    return sessionData;
  }

  public register(mailRecibido:string, passwordRecibida:string)
  {
      const auth = getAuth();
      
      createUserWithEmailAndPassword(auth, mailRecibido, passwordRecibida).then(async (userCredential) => 
      {
        console.log("El registro de usuario fue satisfactorio. Bienvenido/a.");
        // this.mostrarSatisfaccion("El inicio de sesión fue satisfactorio. Bienvenido/a.");

        // Signed in
        const userLoged = userCredential.user;
        this.isLoged = true;
        this.userLogedmail = userLoged.email;
        this.isAdmin = await this.isAdministrador(userLoged.email);

        console.log("--------------------------");
        console.log("ISLOGED: " + this.isLoged);
        console.log("ISVERIFIED: " + this.isVerified);
        console.log("ISADMIN: " + this.isAdmin);
        console.log("USERLOGEDMAIL: " + this.userLogedmail);
        console.log("--------------------------");
      })
      .catch((error) => 
      {
        console.log(error.code);
      });
  }

  public async enviarMailVerificacion()
  {
    let usuarioAVerificar:any;

    let auth = getAuth();

    onAuthStateChanged(auth, async (userData) => 
    {
      if (userData) 
      {
        console.log("¡INTENTANDO VERIFICAR - EL USUARIO ESTA LOGEADO!");
        usuarioAVerificar = auth.currentUser;
        //usuarioAVerificar.sendEmailVerification();

        await sendEmailVerification(usuarioAVerificar);
      }
    });

    // .then(console.log("Email enviado"))
    // .catch(console.log("Error ocurrido"));
  }

  public async isAdministrador(mailRecibido:any)
  {
    let resultado = false;

    let arrayAdministradores = await this.srvFirebase.leerAdministradoresDB();

    arrayAdministradores.forEach(element => 
    {
      if (element["mail"] == mailRecibido)
      {
        resultado = true;
      }
    });

    return resultado;
  }

  public async isActualSessionAdministrador()
  {
    let resultado = false;

    let arrayAdministradores = await this.srvFirebase.leerAdministradoresDB();

    arrayAdministradores.forEach(element => 
    {
      if (element["mail"] == this.userLogedmail)
      {
        resultado = true;
      }
    });

    return resultado;
  }

  // public async isActualSessionNotVerified()
  // {
  //   let resultado:boolean;

  //   setTimeout(() => {
  //     resultado = this.isVerified;
  //     console.log("Is not verified: " + !resultado);
  //   }, 3000);

  //   return resultado = this.isVerified;
  // }
}
