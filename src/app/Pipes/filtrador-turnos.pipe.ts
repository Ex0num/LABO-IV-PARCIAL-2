import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtradorTurnos'
})
export class FiltradorTurnosPipe implements PipeTransform {

  transform(value: any[], datoFiltrador:any, campoFiltrador:any): any[] 
  {
    let resultado = value;

    console.log("Pipe updating");

    if (campoFiltrador != "Ningun/a")
    {
      switch (campoFiltrador) 
      {
        case "Mail paciente":
        {
          resultado = value.filter( (element)=> 
          {
            if (element.paciente.includes(datoFiltrador) == true)
            {
              return -1;
            }
            else
            {
              return 0;
            }
          });

          break;
        }
        case "Mail especialista":
        {
          resultado = value.filter( (element)=> 
          {
            if (element.especialista.includes(datoFiltrador) == true)
            {
              return -1;
            }
            else
            {
              return 0;
            }
          });

          break;
        }
        case "Fecha":
        {
          resultado = value.filter( (element)=> 
          {
            if (element.info.includes(datoFiltrador) == true)
            {
              return -1;
            }
            else
            {
              return 0;
            }
          });

          break;
        }
        case "Estado":
        {
          resultado = value.filter( (element)=> 
          {
            if (element.estado.includes(datoFiltrador) == true)
            {
              return -1;
            }
            else
            {
              return 0;
            }
          });

          break;
        }
        case "Especialidad":
        {
          resultado = value.filter( (element)=> 
          {
            if (element.especialidad.includes(datoFiltrador) == true)
            {
              return -1;
            }
            else
            {
              return 0;
            }
          });

          break;
        }
        // Datos clinicos a partir de aca
        case "Altura":
        {
          resultado = value.filter( (element)=> 
          {
            if (element.estado == 'realizado' && element.altura == datoFiltrador)
            {
              return -1;
            }
            else
            {
              return 0;
            }
          });

          break;
        }
        case "Peso":
        {
          resultado = value.filter( (element)=> 
          {
            if (element.estado == 'realizado' && element.peso == datoFiltrador)
            {
              return -1;
            }
            else
            {
              return 0;
            }
          });

          break;
        }
        case "Temperatura":
        {
          resultado = value.filter( (element)=> 
          {
            if (element.estado == 'realizado' && element.temperatura == datoFiltrador)
            {
              return -1;
            }
            else
            {
              return 0;
            }
          });

          break;
        }
        case "Presión":
        {
          resultado = value.filter( (element)=> 
          {
            if (element.estado == 'realizado' && element.presion == datoFiltrador)
            {
              return -1;
            }
            else
            {
              return 0;
            }
          });

          break;
        }
        case "Dato personalizado":
        {
          resultado = value.filter( (element)=> 
          {
            if (element.estado == 'realizado' && element.datoPersonalizado == datoFiltrador)
            {
              return -1;
            }
            else
            {
              return 0;
            }
          });

          break;
        }
        case "Valor personalizado":
        {
          resultado = value.filter( (element)=> 
          {
            if (element.estado == 'realizado' && element.valorPersonalizado == datoFiltrador)
            {
              return -1;
            }
            else
            {
              return 0;
            }
          });

          break;
        }
      }
    }

    return resultado;
  }

}
