import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfExportService {

  constructor() {}

  crear_y_descargar_PDF(arrayHistoriaDelPaciente:any)
  {
    let arrayDeTextos:any = [];
    let textRenglon = ' ';

    let nombrePaciente = ' ';

    arrayHistoriaDelPaciente.forEach( (historia:any) => 
    {
      console.log(historia);
     
      arrayDeTextos.push(textRenglon);
      let text =  "Fecha: " + historia.info;
      let text2 =  "Solicitado el dia: " + historia.solicitado;
      let text3 =  "Altura: " + historia.altura + "cm";
      let text4 =  "Peso: " + historia.peso + "kg";
      let text5 =  "Presion: " + historia.presion + "°mmHg";
      let text6 =  "Temperatura: " + historia.presion + "°C";
      nombrePaciente = historia.nombrePaciente;
      arrayDeTextos.push(text);
      arrayDeTextos.push(text2);
      arrayDeTextos.push(text3);
      arrayDeTextos.push(text4);
      arrayDeTextos.push(text5);
      arrayDeTextos.push(text6);
      arrayDeTextos.push(textRenglon);
    });

    let img = document.getElementById("foto-principal-prisud");
    console.log(img);

    const docDefinition:any = 
    { 
      info: 
      {
        title: 'awesome Document',
        author: 'john doe',
        subject: 'subject of document',
        keywords: 'keywords for document',
      },
      content: arrayDeTextos,
    };

    pdfMake.createPdf(docDefinition).download();
  }

  //Crea un link publico de imagen correspondiente al elemento html que le hayamos pasado.
  async crearImagen(elementoHTMLRecibido:any) 
  {
    let imagenCreadaURL;

    await html2canvas(elementoHTMLRecibido).then(canvas => 
    {
      imagenCreadaURL = canvas.toDataURL();     
    });
    
    return imagenCreadaURL;
  }
}
