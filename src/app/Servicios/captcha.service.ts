import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CaptchaService {

  constructor() { }

  arrayPalabras:string[] = ["ABHT1","AS68H","ASVRW","ADND23","ASBG2","ASGB3","GBH52","1A2ASD"];

  public pickearPalabraRandom()
  {
    // Traigo un numero del 0 al 99
    let numeroRandom = Math.floor(Math.random() * (6 - 0 + 1)) + 1;
    let palabraRandom = this.arrayPalabras[numeroRandom];
    return palabraRandom;
  }

}
