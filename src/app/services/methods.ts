import { HttpClient, HttpHeaders } from '@angular/common/http';
import {isPlatformBrowser} from '@angular/common'
import { Injectable,Inject,PLATFORM_ID, signal,computed } from '@angular/core';
import {Observable,throwError} from 'rxjs';
import { GsuiteLoginResponse, GsuiteUser, GtokenDatasession, ParametersCatalogue, ReportCatalogue, RequestPayload, resultRegister, SessionData } from '../models/generals-interfaces';
import { ChartReport } from '../models/report-interfaces';
import { ApexYAxis } from 'apexcharts';
 
@Injectable({
  providedIn: 'root',
})
export class Methods {
  
   private baseURL: string = 'https://wialon-integrated-data.onrender.com'
   private baseUrlLocal:string = 'http://localhost:5000';

   public SessionData  = signal<SessionData>({
    userSalesforce:'',
    passwordSalesForce:'',
    company:''
   });

   public  SessionLoaded = signal<boolean>(false);

  public hasValidSession = computed(() => {
    const session = this.SessionData();

    return Boolean(
      session.userSalesforce &&
      session.passwordSalesForce &&
      session.company
    );
  });


  setSession(data:SessionData):void{
   this.SessionData.set(data);
   this.SessionLoaded.set(true);
   

  };


  clearSession(): void {
  this.SessionData.set({
    userSalesforce: '',
    passwordSalesForce: '',
    company: ''
  });

  this.SessionLoaded.set(false);
}

public reports: ReportCatalogue[] = [
  {
    name: 'raw_data',
    enableChart:false,
    title: 'Datos en crudo',
    method: () => this.GetPostTransactions,
    parameters: [
      {
        name: 'StartDate',
        label: 'Fecha inicio',
        type: 'date',
        enabled: true,
        value: null,
        colClass: 'col-12 col-md-3 col-lg-2'
      },
      {
        name: 'EndDate',
        label: 'Fecha fin',
        type: 'date',
        enabled: true,
        value: null,
        colClass: 'col-12 col-md-3 col-lg-2'
      },
      {
        name: 'selectedVehicle',
        label: 'Vehículo',
        type: 'select-search',
        enabled: true,
        value: null,
        placeholder: 'Buscar vehículo...',
        colClass: 'col-12 col-md-3 col-lg-3',
        options: []
      },
      {
        name: 'selectedTypeVehicle',
        label: 'Tipo vehículo',
        type: 'select',
        enabled: true,
        value: '',
        colClass: 'col-12 col-md-3 col-lg-3',
        options: [
          { label: 'Todos', value: '' },
          { label: 'Liviano', value: 'liviano' },
          { label: 'Pesado', value: 'pesado' }
        ]
      },{
        name: 'selectedDispenser',
        label: 'Dispensador',
        type: 'select',
        enabled: true,
        value: '',
        colClass: 'col-12 col-md-3 col-lg-3',
        options: [
          { label: 'Todos', value: '' },
          { label: 'Candelaria', value: 'Candelaria' },
          { label: 'ICSA01', value: 'ICSA01' }
        ]

      },
      {
        name: 'GroupTransactions',
        label: 'Agrupar transacciones',
        type: 'checkbox',
        enabled: true,
        value: false,
        colClass: 'col-12 col-md-3 col-lg-2'
      }
    ],
    columns:[
  { title: 'N# Transaccion', field: 'tsName', sorter: 'string', minWidth: 150,   bottomCalc: 'count',
    bottomCalcFormatter: (cell: any) => {
      return `Registros: ${cell.getValue()}`;
    } },
  { title: 'Tanque', field: 'tstankDescription', minWidth: 180 },
  { title: 'Dispensador', field: 'tsppPumpID', minWidth: 140 },
  { title: 'Producto', field: 'tspdProductName', minWidth: 140 },
{
  title: 'Fecha',
  field: 'tsDateRefuel',
  sorter: 'string',
  minWidth: 170,
  headerFilter: 'input'
},
  { title: 'Tagcode', field: 'tsTagSalesForceID', minWidth: 130 },
  { title: 'Vehículo', field: 'tsveVehicleID', minWidth: 150,headerFilter: 'input' },
  { title: 'Tipo vehículo', field: 'tsveTypeVehicle', minWidth: 150,headerFilter: 'input' },
  { title: 'Conductor', field: 'tsdvDriverName', minWidth: 180 },
  { title: 'Odómetro', field: 'tsOdometer', minWidth: 120 },
  { title: 'Odómetro previo', field: 'tsPreviusOdometer', minWidth: 150 },
  { title: 'Distancia', field: 'KM', sorter: 'number', minWidth: 120 },
  { title: 'Horómetro', field: 'tsHourometer', minWidth: 120 },
  { title: 'Horómetro previo', field: 'tsPreviusHourmeter', minWidth: 150 },
  { title: 'HRS', field: 'HRS', sorter: 'number', minWidth: 100 },
  { title: 'Contador inicial', field: 'tsStartCounter', minWidth: 150 },
  { title: 'Contador final', field: 'tsEndCounter', minWidth: 150 },
  { title: 'Cantidad', field: 'tsQuantity', sorter: 'number', minWidth: 120,bottomCalc:'sum',  bottomCalcFormatter: (cell: any) => {
    const value = Number(cell.getValue() || 0);
    return value.toFixed(2);
  } },
  { title: 'Eficiencia', field: 'eficiency', sorter: 'number', minWidth: 120,  bottomCalc: 'avg',
  bottomCalcFormatter: (cell: any) => {
    const value = Number(cell.getValue() || 0);
    return value.toFixed(2);
  } }
]
  },
  {
    name:'summary_data',
    enableChart:true,
    title:'Resumen de consumo(por tipo de vehiculo)',
    method: () => {},
    parameters:[
            {
        name: 'StartDate',
        label: 'Fecha inicio',
        type: 'date',
        enabled: true,
        value: null,
        colClass: 'col-12 col-md-3 col-lg-2'
      },
      {
        name: 'EndDate',
        label: 'Fecha fin',
        type: 'date',
        enabled: true,
        value: null,
        colClass: 'col-12 col-md-3 col-lg-2'
      },
      {
        name: 'selectedTypeVehicle',
        label: 'Tipo vehículo',
        type: 'select',
        enabled: true,
        value: '',
        colClass: 'col-12 col-md-3 col-lg-3',
        options: [
          { label: 'Todos', value: '' },
          { label: 'Liviano', value: 'liviano' },
          { label: 'Pesado', value: 'pesado' }
        ]
      },
       {
        name: 'GroupTransactions',
        label: 'Agrupar transacciones',
        type: 'checkbox',
        enabled: true,
        value: false,
        colClass: 'col-12 col-md-3 col-lg-2'
      }
    ],
    columns:[
        { title: 'Vehículo', field: 'tsveVehicleID', minWidth: 150,headerFilter: 'input' },
        { title: 'Tipo vehículo', field: 'tsveTypeVehicle', minWidth: 150,headerFilter: 'input' },
         { title: 'HRS', field: 'HRS_sum', sorter: 'number', minWidth: 100 },
        { title: 'Distancia', field: 'KM_sum', sorter: 'number', minWidth: 120 },
       { title: 'Eficiencia', field: 'eficiency_avg', sorter: 'number', minWidth: 120,  bottomCalc: 'avg',
  bottomCalcFormatter: (cell: any) => {
    const value = Number(cell.getValue() || 0);
    return value.toFixed(2);
  } },
        { title: 'Cantidad', field: 'tsQuantity_sum', sorter: 'number', minWidth: 120,bottomCalc:'sum',  bottomCalcFormatter: (cell: any) => {
    const value = Number(cell.getValue() || 0);
    return value.toFixed(2);
  } }

    ]
  }
];
   

public chartReports:ChartReport[] = [
  {
    name:'summary_data',
    chart:{
      series:[],
      xaxis:{categories:[]},
      colors:['#4f46e5', '#d8cb1aff'],
      chart:{
        type:'line',
        toolbar:{
          show:true,
            tools: {
        download: true,
        selection: true,
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: true,
        reset: true
      },
        },
        zoom:{
          enabled:true
        }
      },
      tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val: number, { seriesIndex }) =>
          seriesIndex === 0 ? `${(val ?? 0).toFixed(1)} gal` : `${(val ?? 0).toFixed(2)} km/gal`
      }
    },
    legend:{ position: 'top', horizontalAlign: 'left' },
    grid:{strokeDashArray:4},
    dataLabels:{
      enabled:true
    },
    markers:{
      size:0
    },
    yaxis:[    { title: { text: 'Cantidad' } },
      { title: { text: 'Eficiencia' }, opposite: true, min: 0 }] as ApexYAxis[],
  responsive: [
      {
        breakpoint: 640,
        options: {
          chart: { height: 320 },
          legend: { position: 'bottom', horizontalAlign: 'center' }
        }
      }
    ]
    }
    

  },
  {
    name:'dashboard_pastel',
    chart:{
      series:[],
      chart:{
        type:'donut',
        toolbar:{
          show:true,
          tools:{
            download:true,
            reset:true
          }
        }
      },

     plotOptions: {
            pie: {
              dataLabels: {
                offset:-5
              },
              donut:{
                labels:{
                  show:true,
                  total:{
                    show:true,
                    showAlways:true,
                    formatter: (w: any): string => {
        const total = w.globals.seriesTotals.reduce(
          (sum: number, value: number) => sum + value,
          0
        );

        return total.toFixed(2);
      }
                  }
                }
              }
            },
            
          },

          legend:{
            show:true
          },
          labels:[],
          dataLabels:{  enabled:true},
          title:{text:'Resumen de Surtidores'},
            responsive: [
      {
        breakpoint: 640,
        options: {
          chart: { height: 320 },
          legend: { position: 'bottom', horizontalAlign: 'center' }
        }
      }
    ]


    }
  }
]

  constructor( private http: HttpClient,
     @Inject(PLATFORM_ID) private platformId: Object
  ) {}



loginsuite(credentials: { email: string; password: string }):Observable<GsuiteLoginResponse> {
      const url = `${this.baseURL}/gsuite/login`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<GsuiteLoginResponse>(url, credentials, { headers });

};



 private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }


  validateSession(): Observable<GtokenDatasession> {
    const url = `${this.baseURL}/gsuite/session`;

    if (!this.isBrowser()) {
      return throwError(() => new Error('localStorage no disponible en servidor'));
    }

    const token = localStorage.getItem('gsuiteToken');

    if (!token) {
      return throwError(() => new Error('No existe token de sesión'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<GtokenDatasession>(url, { headers });
  }



  GetPostDataCatalogue<T>(sendto:ParametersCatalogue):Observable<T[]>
  {
     const uri = `${this.baseURL}/gsuite/catalogueData`;


  const header = new HttpHeaders({
  'Content-Type':'application/json'
  });

return this.http.post<T[]>(uri,sendto,{headers:header}); 
  };

  

  GetPostTransactions(sendto:RequestPayload):Observable<resultRegister>{

    const uri = `${this.baseURL}/gsuite/RefuelsData`;

    const header = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<resultRegister>(uri, sendto, { headers: header });

  }


}
