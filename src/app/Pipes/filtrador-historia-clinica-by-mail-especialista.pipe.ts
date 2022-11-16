import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtradorHistoriaClinicaByMailEspecialista'
})
export class FiltradorHistoriaClinicaByMailEspecialistaPipe implements PipeTransform {

  transform(arrayHistoriasClinicas: any[], mailFiltrador:any): any 
  {
    if (mailFiltrador == "" || mailFiltrador == undefined || mailFiltrador == " ")
    {
      return arrayHistoriasClinicas;
    }
    else
    {
      let arrayString = ["a","bc","d"];
      console.log(arrayString.includes("bc"));

      let arrayFiltrado:any = arrayHistoriasClinicas;

      arrayFiltrado = arrayHistoriasClinicas.filter( (element) => 
      {
        if (element.especialista == mailFiltrador)
        {
          return -1;
        }
        else
        {
          // console.log(element.correoEspecialista);
          // console.log(mailFiltrador);
          // console.log(element);
          return 0;
        }
      });

      return arrayFiltrado;
    }
  }

}
