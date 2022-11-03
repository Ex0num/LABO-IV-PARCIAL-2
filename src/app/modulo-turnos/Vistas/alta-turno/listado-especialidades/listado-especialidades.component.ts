import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FirebaseService } from 'src/app/Servicios/firebase.service';

@Component({
  selector: 'app-listado-especialidades',
  templateUrl: './listado-especialidades.component.html',
  styleUrls: ['./listado-especialidades.component.css']
})
export class ListadoEspecialidadesComponent implements OnInit {

  constructor(public srvFirebase:FirebaseService) {}

  async ngOnInit(): Promise<void> 
  {
    this.arrayEspecialidades =  await this.srvFirebase.leerEspecialidades();
  }

  arrayEspecialidades:any;

  @Output() public especialidadClickeada = new EventEmitter<any>();
  
  especialidadElegida(especialidadRecibida:string)
  {
    this.especialidadClickeada.emit(especialidadRecibida);
  }


}
