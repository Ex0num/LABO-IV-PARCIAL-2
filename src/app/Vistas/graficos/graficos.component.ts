import { Component, OnInit } from '@angular/core';

import Chart from 'chart.js/auto'; 
import { FirebaseService } from 'src/app/Servicios/firebase.service';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css']
})
export class GraficosComponent implements OnInit {

  constructor(public srvFirebase:FirebaseService){}

  public chart1:any;
  public dataChart1:any = [];

  public chart2:any;
  public labelsChart2:any = [];
  public valuesChart2:any = [];

  public chart3:any;
  public labelsChart3:any = [];
  public valuesChart3:any = [];

  public chart4:any;
  public labelsChart4:any = [];
  public valuesChart4:any = [];

  public chart5:any;
  public labelsChart5:any = [];
  public valuesChart5:any = [];

  async ngOnInit(): Promise<void> 
  {
    this.dataChart1 = await this.srvFirebase.leerLogsPorDiasDB();
    
    let diccionarioEspecialidadesConMasTurnos = await this.srvFirebase.especialidadesConMayorTurnos();
    let diccionarioDiasConMasTurnos = await this.srvFirebase.diasConMayorTurnos();
    let diccionarioTOP3MedicosConMasTurnosSolicitados = await this.srvFirebase.medicosConMayorTurnosSolicitados();
    let diccionarioTOP3MedicosConMasTurnosFinalizados = await this.srvFirebase.medicosConMayorTurnosFinalizados();

    diccionarioEspecialidadesConMasTurnos.forEach( (value, key) => 
    {
      let newObj = {valor: value, clave: key};

      this.labelsChart2.push(newObj.clave);
      this.valuesChart2.push(diccionarioEspecialidadesConMasTurnos.get(key));
    });

    diccionarioDiasConMasTurnos.forEach( (value, key) => 
    {
      let newObj = {valor: value, clave: key};

      this.labelsChart3.push(newObj.clave);
      this.valuesChart3.push(diccionarioDiasConMasTurnos.get(key));
    });

    diccionarioTOP3MedicosConMasTurnosSolicitados.forEach( (value, key) => 
    {
      let newObj = {valor: value, clave: key};

      this.labelsChart4.push(newObj.clave);
      this.valuesChart4.push(diccionarioTOP3MedicosConMasTurnosSolicitados.get(key));
    });

    diccionarioTOP3MedicosConMasTurnosFinalizados.forEach( (value, key) => 
    {
      let newObj = {valor: value, clave: key};

      this.labelsChart5.push(newObj.clave);
      this.valuesChart5.push(diccionarioTOP3MedicosConMasTurnosFinalizados.get(key));
    });


    const ctx1:any = document.getElementById('chart1'); 
    const ctx2:any = document.getElementById('chart2'); 
    const ctx3:any = document.getElementById('chart3'); 
    const ctx4:any = document.getElementById('chart4'); 
    const ctx5:any = document.getElementById('chart5'); 

    this.chart1 = new Chart(ctx1, {
      type: 'bar',
      data: {
          labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábados', 'Domingos'],
          datasets: [{
              label: 'Ingresos al sistema Prisud por días.',
              data: this.dataChart1,
              backgroundColor: [
                'red',
                'yellow',
                'blue',
                'pink',
                'green',
                'brown',
                'gray'
            ],
            borderColor: 'purple'
          }]
      },
      options: {scales: {y: {beginAtZero: true}},responsive: true, maintainAspectRatio: false}
    });

    this.chart2 = new Chart(ctx2, {
      type: 'pie',
      data: {
          labels: this.labelsChart2,
          datasets: [{
              label: 'Ingresos al sistema Prisud por días.',
              data: this.valuesChart2,
              backgroundColor: [
                'blue',
                'green',
                'pink',
                'yellow',
                'brown',
                'red',
                'gray'
            ],
            borderColor: 'purple'
          }]
      },
      options: {scales: {y: {beginAtZero: true}},responsive: true, maintainAspectRatio: false}
    });

    this.chart3 = new Chart(ctx3, {
      type: 'doughnut',
      data: {
          labels: this.labelsChart3,
          datasets: [{
              label: 'Los medicos con mas turnos solicitados',
              data: this.valuesChart3,
              backgroundColor: [
                'brown',
                'pink',
                'red',
                'yellow',
                'blue',
                'green',
                'gray'
            ],
            borderColor: 'purple'
          }]
      },
      options: {scales: {y: {beginAtZero: true}},responsive: true, maintainAspectRatio: false}
    });

    this.chart4 = new Chart(ctx4, {
      type: 'bar',
      data: {
          labels: this.labelsChart4,
          datasets: [{
              label: 'Médicos con más turnos solicitados del 2021 al 2022.',
              data: this.valuesChart4,
              backgroundColor: [
                'green',
                'brown',
                'red',
                'yellow',
                'blue',
                'pink',
                'gray'
            ],
            borderColor: 'purple'
          }]
      },
      options: {scales: {y: {beginAtZero: true}},responsive: true, maintainAspectRatio: false}
    });

    this.chart5 = new Chart(ctx5, {
      type: 'polarArea',
      data: {
          labels: this.labelsChart5,
          datasets: [{
              label: 'Médicos con más turnos finalizados del 2021 al 2022.',
              data: this.valuesChart5,
              backgroundColor: [
                'gray',
                'pink',
                'brown',
                'yellow',
                'blue',
                'red',
                'green'
            ],
            borderColor: 'purple'
          }]
      },
      options: {scales: {y: {beginAtZero: true}},responsive: true, maintainAspectRatio: false}
    });

  }
}
