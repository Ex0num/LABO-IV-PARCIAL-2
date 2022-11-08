import { Injectable } from '@angular/core';

import * as XLSX from 'xlsx';
import { FileSaverService } from 'ngx-filesaver';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  constructor(public srvFirebase:FirebaseService) {}

  async exportar_ArrayObjetos_toExcel(arrayObjetos:any ,nombreDeArchivoRecibido:string, nombreDeHojaRecibido:string)
  {
    let arrayUsuarios = await this.srvFirebase.leerPacientesDB();
    arrayUsuarios.concat(await this.srvFirebase.leerEspecialistasDB());
    arrayUsuarios.concat(await this.srvFirebase.leerAdministradoresDB());

    const worksheet = XLSX.utils.json_to_sheet(arrayObjetos);
    console.log(worksheet);

    const wb:XLSX.WorkBook  = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, worksheet, nombreDeHojaRecibido);

    XLSX.writeFile(wb,nombreDeArchivoRecibido + ".xlsx");
  }
}
