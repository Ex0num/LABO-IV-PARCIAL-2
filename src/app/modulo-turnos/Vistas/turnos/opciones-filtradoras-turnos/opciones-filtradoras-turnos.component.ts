import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FirebaseService } from 'src/app/Servicios/firebase.service';

@Component({
  selector: 'app-opciones-filtradoras-turnos',
  templateUrl: './opciones-filtradoras-turnos.component.html',
  styleUrls: ['./opciones-filtradoras-turnos.component.css']
})
export class OpcionesFiltradorasTurnosComponent implements OnInit {

  constructor(public srvFirebase:FirebaseService) {}

  async ngOnInit(): Promise<void> 
  {

    this.arrayEspecialistas = await this.srvFirebase.leerEspecialistasDB();
    this.arrayEspecialidades =  await this.srvFirebase.leerEspecialidades();
  }

  @Output() public opcionClickeada = new EventEmitter<any>();
  
  opcionFiltradoraSeleccionada = 'none';

  arrayEspecialistas:any;
  arrayEspecialidades:any;

  opcionClickeadaEvent(dataRecibida:any, tipoRecibido:any)
  {
    console.log("ENVIANDO EVENTO");

    let infoFiltro = 
    {
      data: dataRecibida,
      tipo: tipoRecibido,
    }

    this.opcionClickeada.emit(infoFiltro);
  }

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
