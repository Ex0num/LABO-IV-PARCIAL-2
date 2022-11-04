import { Injectable } from '@angular/core';
import { collection, doc, Firestore, getDocs, getFirestore, setDoc, updateDoc } from 'firebase/firestore/lite';
import { getDownloadURL, ref, uploadBytes, uploadString, getStorage } from '@firebase/storage'
import { Paciente } from '../Entidades/paciente';
import { environment } from 'src/environments/environment';
import { administradores, db, especialistas, pacientes, storage, turnos } from '../app.component';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService 
{
  constructor() {}

  // ---------------------- PACIENTES ---------------------------//

  public async subirPacienteDB(mailRecibido:string, passwordRecibido:string, nombreRecibido:string, apellidoRecibido:string, edadRecibida:number, dniRecibido:number, foto1Recibida:string, foto2Recibida:any) 
  {
    
    //Estructuro el paciente
    let pacienteEstructurado = 
    {
      mail: mailRecibido,
      password: passwordRecibido,
      nombre: nombreRecibido,
      apellido: apellidoRecibido,
      edad: edadRecibida,
      dni: dniRecibido,
      foto1: foto1Recibida,
      foto2: foto2Recibida
    }

    console.log("a");

    this.subirFotosPaciente(pacienteEstructurado.foto1, pacienteEstructurado.foto2, pacienteEstructurado);
  }

  private async subirFotosPaciente(filePhoto1:any, filePhoto2:any, pacienteEstructuradoRecibido:any)
  {
    console.log("b");

    let lastId = this.getLastIDPacientes();
    let newID = await lastId + 1;

    let fechaValidaActual = new Date().toLocaleDateString();
    let horaValidaActual = new Date().toLocaleTimeString();
    do { fechaValidaActual = fechaValidaActual.replace("/",":"); } while(fechaValidaActual.includes("/"));

    //---------------
    let referencia1 = ref(storage, `images/${pacienteEstructuradoRecibido.mail + "/" + pacienteEstructuradoRecibido.dni + "-" + fechaValidaActual + "-" + horaValidaActual + "-" + "v1"} `);
    //---------------
    let referencia2 = ref(storage, `images/${pacienteEstructuradoRecibido.mail + "/" + pacienteEstructuradoRecibido.dni + "-" + fechaValidaActual + "-" + horaValidaActual + "-" + "v2"} `);
    //---------------

    await uploadBytes(referencia1, filePhoto1).then(async (snapshot)=>
    {
      await getDownloadURL(referencia1).then(async (url)=>
      { 
        pacienteEstructuradoRecibido.foto1 = url;
      });
    }).catch( () => { console.log("Error");})
    
    await uploadBytes(referencia2, filePhoto2).then(async (snapshot)=>
    {
      await getDownloadURL(referencia2).then(async (url)=>
      { 
        pacienteEstructuradoRecibido.foto2 = url;
      });
    }).catch( () => { console.log("Error");})

    console.log(pacienteEstructuradoRecibido);
    
    let newDocument = doc(db, "pacientes", newID.toString());
    await setDoc(newDocument, pacienteEstructuradoRecibido);
  }

  private async getLastIDPacientes()
  {
    console.log("c");

    let querySnapshot = getDocs(pacientes);
    let flagMax = 0;

    (await ((querySnapshot))).docs.forEach((doc) => 
    {
      if (parseInt(doc.id) > flagMax)
      {
        flagMax = parseInt(doc.id);
        // console.log(flagMax);
      }
    });

    console.log(flagMax);
    return flagMax;
  }

  public async leerPacientesDB()
  {
    let arrayPacientes = new Array();

    const querySnapshot = await getDocs(pacientes);
    querySnapshot.forEach((doc) => 
    {
      let user = 
      {
        mail: doc.data()['mail'],
        password: doc.data()['password'],
        nombre: doc.data()['nombre'],
        apellido: doc.data()['apellido'],
        edad: doc.data()['edad'],
        dni: doc.data()['dni'],
        foto1: doc.data()['foto1'],
        foto2: doc.data()['foto2']
      }

      arrayPacientes.push(user);
    });

    console.log(arrayPacientes);
    return arrayPacientes;
  }

  // ---------------------- ESPECIALISTAS ---------------------------//

  public async subirEspecialistaDB(mailRecibido:string, passwordRecibido:string, nombreRecibido:string, apellidoRecibido:string, edadRecibida:number, dniRecibido:number, foto1Recibida:string, especialidadesRecibidas:any) 
  {
    
    //Estructuro el paciente
    let especialistaEstructurado = 
    {
      mail: mailRecibido,
      password: passwordRecibido,
      nombre: nombreRecibido,
      apellido: apellidoRecibido,
      edad: edadRecibida,
      dni: dniRecibido,
      foto1: foto1Recibida,
      especialidades: especialidadesRecibidas,
      estadoCuenta: "inhabilitado",
      horarioLunes: [],
      horarioMartes: [],
      horarioMiercoles: [],
      horarioJueves: [],
      horarioViernes: [],
      horarioSabado: [],
    }

    this.subirFotosEspecialista(especialistaEstructurado.foto1, especialistaEstructurado);
  }

  private async subirFotosEspecialista(filePhoto1:any, especialistaEstructuradoRecibido:any)
  {
    let lastId = this.getLastIDEspecialistas();
    let newID = await lastId + 1;

    let fechaValidaActual = new Date().toLocaleDateString();
    let horaValidaActual = new Date().toLocaleTimeString();
    do { fechaValidaActual = fechaValidaActual.replace("/",":"); } while(fechaValidaActual.includes("/"));
    
    let referencia = ref(storage, `images/${especialistaEstructuradoRecibido.mail + "/" + especialistaEstructuradoRecibido.dni + "-" + fechaValidaActual + "-" + horaValidaActual + "-" + "v1"}`);

    await uploadBytes(referencia, filePhoto1).then(async (snapshot)=>
    {
      await getDownloadURL(referencia).then(async (url)=>
      { 
        especialistaEstructuradoRecibido.foto1 = url;
      });
    }).catch( () => { console.log("Error");})
    
    console.log(especialistaEstructuradoRecibido);
    
    let newDocument = doc(db, "especialistas", newID.toString());
    await setDoc(newDocument, especialistaEstructuradoRecibido);
  }

  private async getLastIDEspecialistas()
  {
    let querySnapshot = getDocs(especialistas);
    let flagMax = 0;

    (await ((querySnapshot))).docs.forEach((doc) => 
    {
      if (parseInt(doc.id) > flagMax)
      {
        flagMax = parseInt(doc.id);
        // console.log(flagMax);
      }
    });

    console.log(flagMax);
    return flagMax;
  }

  public async leerEspecialistasDB()
  {
    let arrayEspecialistas = new Array();

    const querySnapshot = await getDocs(especialistas);
    querySnapshot.forEach((doc) => 
    {
      let user = 
      {
        mail: doc.data()['mail'],
        password: doc.data()['password'],
        nombre: doc.data()['nombre'],
        apellido: doc.data()['apellido'],
        edad: doc.data()['edad'],
        dni: doc.data()['dni'],
        foto1: doc.data()['foto1'],
        especialidades: doc.data()['especialidades'],
        estadoCuenta: doc.data()['estadoCuenta'],
        horarioLunes: doc.data()['horarioLunes'],
        horarioMartes: doc.data()['horarioMartes'],
        horarioMiercoles: doc.data()['horarioMiercoles'],
        horarioJueves: doc.data()['horarioJueves'],
        horarioViernes: doc.data()['horarioViernes'],
        horarioSabado: doc.data()['horarioSabado'],
      }

      arrayEspecialistas.push(user);
    });

    console.log(arrayEspecialistas);
    return arrayEspecialistas;
  }

  public async setearEstadoCuentaEspecialista(mailEspecialistaRecibido:string, estadoCuentaRecibido:string)
  {
    let especialistaEncontrado = await this.buscarEspecialistaPorMail(mailEspecialistaRecibido); 

    
    especialistaEncontrado[0].estadoCuenta = estadoCuentaRecibido;
    console.log("ESTADO CUENTA NUEVO:" + especialistaEncontrado[0].estadoCuenta);
    
    let idDoc = await this.obtenerIDEspecialistaPorMail(especialistaEncontrado[0].mail);
    this.modificarEspecialista(especialistaEncontrado[0], idDoc);

  }

  modificarEspecialista(especialistaEstructuradoRecibido:any, idEspecialistaRecibido:number)
  {
    let docRef = doc(db, `especialistas/${idEspecialistaRecibido}`);
    return updateDoc(docRef, especialistaEstructuradoRecibido);
  }

  public async buscarEspecialistaPorMail(mailEspecialistaRecibido:string)
  {
    let arrayLeidoDeEspecialistas = await this.leerEspecialistasDB();
  
    let arrayFiltrado = arrayLeidoDeEspecialistas.filter( (a)=> 
    { if (a.mail == mailEspecialistaRecibido)
      {
        return -1;
      }
      else
      {
        return 0;
      }
    }
    );

    return arrayFiltrado;
  }
  
  public async obtenerIDEspecialistaPorMail(mailEspecialistaRecibido:string)
  {
    const querySnapshot = await getDocs(especialistas);

    let idEncontrada = -1;

    querySnapshot.forEach((doc) => 
    {
        if (doc.data()["mail"] == mailEspecialistaRecibido)
        {
          idEncontrada = parseInt(doc.id);
        }
    });

    return idEncontrada;
  }

  public async leerEspecialidades()
  {
    let arrayEspecialidades = new Array();
    let arrayEspecialidadesNoRepetidas = new Array();
    let arrayEspecialistas = await this.leerEspecialistasDB();

    arrayEspecialistas.forEach( (especialista)=> 
    { 
      especialista.especialidades.forEach( (especialidad:any) => 
      {
        arrayEspecialidades.push(especialidad);
      });
    });
    
    arrayEspecialidades.forEach( (element)=> 
    {
        if (!arrayEspecialidadesNoRepetidas.includes(element))
        {
          arrayEspecialidadesNoRepetidas.push(element);
        }
    });

    return arrayEspecialidadesNoRepetidas;
  }

  // ---------------------- ADMINISTRADORES ---------------------------//

  public async subirAdministradorDB(mailRecibido:string, passwordRecibido:string, nombreRecibido:string, apellidoRecibido:string, edadRecibida:number, dniRecibido:number, foto1Recibida:string) 
  {
    //Estructuro el administrador
    let administradorEstructurado = 
    {
      mail: mailRecibido,
      password: passwordRecibido,
      nombre: nombreRecibido,
      apellido: apellidoRecibido,
      edad: edadRecibida,
      dni: dniRecibido,
      foto1: foto1Recibida,
    }

    this.subirFotosAdministrador(administradorEstructurado.foto1, administradorEstructurado);
  }

  private async subirFotosAdministrador(filePhoto1:any, administradorEstructuradoRecibido:any)
  {
    let lastId = this.getLastIDAdministradores();
    let newID = await lastId + 1;

    let fechaValidaActual = new Date().toLocaleDateString();
    let horaValidaActual = new Date().toLocaleTimeString();
    do { fechaValidaActual = fechaValidaActual.replace("/",":"); } while(fechaValidaActual.includes("/"));
    
    let referencia = ref(storage, `images/${administradorEstructuradoRecibido.mail + "/" + administradorEstructuradoRecibido.dni + "-" + fechaValidaActual + "-" + horaValidaActual + "-" + "v1"}`);

    await uploadBytes(referencia, filePhoto1).then(async (snapshot)=>
    {
      await getDownloadURL(referencia).then(async (url)=>
      { 
        administradorEstructuradoRecibido.foto1 = url;
      });
    }).catch( () => { console.log("Error");})
    
    console.log(administradorEstructuradoRecibido);
    
    let newDocument = doc(db, "administradores", newID.toString());
    await setDoc(newDocument, administradorEstructuradoRecibido);
  }

  private async getLastIDAdministradores()
  {
    let querySnapshot = getDocs(administradores);
    let flagMax = 0;

    (await ((querySnapshot))).docs.forEach((doc) => 
    {
      if (parseInt(doc.id) > flagMax)
      {
        flagMax = parseInt(doc.id);
      }
    });

    console.log(flagMax);
    return flagMax;
  }

  public async leerAdministradoresDB()
  {
    let arrayAdministradores = new Array();

    const querySnapshot = await getDocs(administradores);
    querySnapshot.forEach((doc) => 
    {
      //creo el usuario y le agrego la data
      let user = 
      {
        mail: doc.data()['mail'],
        password: doc.data()['password'],
        nombre: doc.data()['nombre'],
        apellido: doc.data()['apellido'],
        foto1: doc.data()['foto1'],
        edad: doc.data()['edad'],
        dni: doc.data()['dni'],
      }

      arrayAdministradores.push(user);
    });

    console.log(arrayAdministradores);
    return arrayAdministradores;
  }

  // ---------------------- TURNOS ---------------------------//

  public async leerTurnosDB()
  {
    let arrayTurnos = new Array();

    const querySnapshot = await getDocs(turnos);
    querySnapshot.forEach((doc) => 
    {
      //creo el usuario y le agrego la data
      let turno = 
      {
        especialista: doc.data()['especialista'],
        paciente: doc.data()['paciente'],
        estado: doc.data()['estado'],
        info: doc.data()['info'],
        especialidad: doc.data()['especialidad'],
        solicitado: doc.data()['solicitado'],
        resena: doc.data()['resena'],
        comentario: doc.data()['comentario'],
      }

      arrayTurnos.push(turno);
    });

    console.log(arrayTurnos);
    return arrayTurnos;
  }

  public async subirTurnoDB(especialidadRecibida:any, especialistaRecibido:any, fechaTurnoRecibida:any, mailPacienteRecibido:any, resenaRecibido:any) 
  {
    let fecha = new Date();
    let fechaActual = fecha.toLocaleTimeString();

    let turnoEstructurado = 
    {
      especialista: especialistaRecibido,
      estado: 'pendiente',
      especialidad: especialidadRecibida,
      info: fechaTurnoRecibida,
      paciente: mailPacienteRecibido,
      solicitado: fechaActual,
      resena: '',
      comentario: '',
      encuesta: '',
      valoracion: '',
    }

    let lastId = this.getLastIDTurnos();
    let newID = await lastId + 1;

    let newDocument = doc(db, "turnos", newID.toString());
    await setDoc(newDocument, turnoEstructurado);
  }

  public async leerTurnosByMailDB(mailpacienteRecibido:string)
  {
    let arrayTurnos = new Array();

    const querySnapshot = await getDocs(turnos);
    querySnapshot.forEach((doc) => 
    {
      //creo el usuario y le agrego la data
      let turno = 
      {
        especialista: doc.data()['especialista'],
        paciente: doc.data()['paciente'],
        estado: doc.data()['estado'],
        info: doc.data()['info'],
        especialidad: doc.data()['especialidad'],
        solicitado: doc.data()['solicitado'],
        resena: doc.data()['resena'],
        comentario: doc.data()['comentario'],
        encuesta: doc.data()['encuesta'],
        valoracion: doc.data()['valoracion'],
      }

      arrayTurnos.push(turno);
    });

    let arrayTurnosFiltrado = arrayTurnos.filter( (a)=>{ if (a.paciente == mailpacienteRecibido){return -1} else {return 0}});
    console.log("ARRAY TURNOS FILTRADO BY USER:");
    console.log(arrayTurnosFiltrado);

    return arrayTurnosFiltrado;
  }

  public async leerTurnosByMailEspecialistaDB(mailEspecialistaRecibido:string)
  {
    let arrayTurnos = new Array();

    const querySnapshot = await getDocs(turnos);
    querySnapshot.forEach((doc) => 
    {
      //creo el usuario y le agrego la data
      let turno = 
      {
        especialista: doc.data()['especialista'],
        paciente: doc.data()['paciente'],
        estado: doc.data()['estado'],
        info: doc.data()['info'],
        especialidad: doc.data()['especialidad'],
        solicitado: doc.data()['solicitado'],
        resena: doc.data()['resena'],
        comentario: doc.data()['comentario'],
        encuesta: doc.data()['encuesta'],
        valoracion: doc.data()['valoracion'],
      }

      arrayTurnos.push(turno);
    });

    let arrayTurnosFiltrado = arrayTurnos.filter( (a)=>{ if (a.especialista == mailEspecialistaRecibido){return -1} else {return 0}});
    console.log("ARRAY TURNOS FILTRADO BY SPECIALIST:");
    console.log(arrayTurnosFiltrado);

    return arrayTurnosFiltrado;
  }

  private async getLastIDTurnos()
  {
    let querySnapshot = getDocs(turnos);
    let flagMax = 0;

    (await ((querySnapshot))).docs.forEach((doc) => 
    {
      if (parseInt(doc.id) > flagMax)
      {
        flagMax = parseInt(doc.id);
      }
    });

    console.log(flagMax);
    return flagMax;
  }

  public async obtenerIDTurnoPorFechaYEstado(infoRecibida:string, estadoRecibido:string)
  {
    const querySnapshot = await getDocs(turnos);

    let idEncontrada = -1;

    querySnapshot.forEach((doc) => 
    {
        if (doc.data()["info"] == infoRecibida && doc.data()["estado"] == estadoRecibido)
        {
          idEncontrada = parseInt(doc.id);
        }
    });

    return idEncontrada;
  }

  
  public async setearEstadoyComentarioTurno(fechaRecibida:string, estadoViejo:string, estadoTurnoRecibido:string, comentarioRecibido:string)
  {
    let turnoEncontrado = await this.buscarTurnoPorFechaYEstado(fechaRecibida,estadoViejo); 
    console.log(turnoEncontrado);

    turnoEncontrado[0].estado = estadoTurnoRecibido;
    turnoEncontrado[0].comentario = comentarioRecibido;

    let idDoc = await this.obtenerIDTurnoPorFechaYEstado(turnoEncontrado[0].info,estadoViejo);
    console.log(idDoc);
    this.modificarTurno(turnoEncontrado[0], idDoc);

  }

  public async setearEstadoyEncuestaTurno(fechaRecibida:string, estadoViejo:string, estadoTurnoRecibido:string, encuestaRecibida:string)
  {
    let turnoEncontrado = await this.buscarTurnoPorFechaYEstado(fechaRecibida,estadoViejo); 
    console.log(turnoEncontrado);

    turnoEncontrado[0].estado = estadoTurnoRecibido;
    turnoEncontrado[0].encuesta = encuestaRecibida;

    let idDoc = await this.obtenerIDTurnoPorFechaYEstado(turnoEncontrado[0].info,estadoViejo);
    console.log(idDoc);
    this.modificarTurno(turnoEncontrado[0], idDoc);

  }

  public async setearEstadoyValoracionTurno(fechaRecibida:string, estadoViejo:string, estadoTurnoRecibido:string, valoracionRecibida:string)
  {
    let turnoEncontrado = await this.buscarTurnoPorFechaYEstado(fechaRecibida,estadoViejo); 
    console.log(turnoEncontrado);

    turnoEncontrado[0].estado = estadoTurnoRecibido;
    turnoEncontrado[0].valoracion = valoracionRecibida;

    let idDoc = await this.obtenerIDTurnoPorFechaYEstado(turnoEncontrado[0].info,estadoViejo);
    console.log(idDoc);
    this.modificarTurno(turnoEncontrado[0], idDoc);

  }

  public async setearEstadoyResenaTurno(fechaRecibida:string, estadoViejo:string, estadoTurnoRecibido:string, resenaRecibida:string)
  {
    let turnoEncontrado = await this.buscarTurnoPorFechaYEstado(fechaRecibida,estadoViejo); 
    console.log(turnoEncontrado);

    turnoEncontrado[0].estado = estadoTurnoRecibido;
    turnoEncontrado[0].resena = resenaRecibida;

    let idDoc = await this.obtenerIDTurnoPorFechaYEstado(turnoEncontrado[0].info,estadoViejo);
    console.log(idDoc);
    this.modificarTurno(turnoEncontrado[0], idDoc);
  }

  

  modificarTurno(turnoEstructuradoRecibido:any, idTurnoRecibido:number)
  {
    let docRef = doc(db, `turnos/${idTurnoRecibido}`);
    return updateDoc(docRef, turnoEstructuradoRecibido);
  }

  public async buscarTurnoPorFechaYEstado(fechaRecibida:string, estadoRecibido:string)
  {
    let arrayLeidoDeTurnos = await this.leerTurnosDB();
  
    let arrayFiltrado = arrayLeidoDeTurnos.filter( (a)=> 
    { if (a.info == fechaRecibida && a.estado == estadoRecibido)
      {
        return -1;
      }
      else
      {
        return 0;
      }
    }
    );

    return arrayFiltrado;
  }


  // ------------------------- USUARIOS ----------------------//

  public async buscarUsuarioByMail(mailRecibido:any)
  {
    let administradores = await this.leerAdministradoresDB();
    let especialistas = await this.leerEspecialistasDB();
    let pacientes = await this.leerPacientesDB();

    administradores = administradores.filter((a)=>{if (a.mail == mailRecibido){return -1}else{return 0}});
    especialistas = especialistas.filter((a)=>{if (a.mail == mailRecibido){return -1}else{return 0}});
    pacientes = pacientes.filter((a)=>{if (a.mail == mailRecibido){return -1}else{return 0}});

    if (administradores.length > 0)
    {
      administradores[0].tipo = "administrador";
      return administradores[0];
    }
    else if (especialistas.length > 0)
    {
      especialistas[0].tipo = "especialista";
      return especialistas[0];
    }
    else if (pacientes.length > 0)
    {
      pacientes[0].tipo = "paciente";
      return pacientes[0];
    }
  }
}
