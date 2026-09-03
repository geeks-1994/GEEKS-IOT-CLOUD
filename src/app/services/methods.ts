import { HttpClient, HttpHeaders } from '@angular/common/http';
import {isPlatformBrowser} from '@angular/common'
import { Injectable,Inject,PLATFORM_ID, signal,computed } from '@angular/core';
import {Observable,throwError} from 'rxjs';
import { GsuiteLoginResponse, GsuiteUser, GtokenDatasession, MeasureData, ParametersCatalogue, ReportCatalogue, RequestMeasure, RequestPayload, ResultMeasure, resultRegister, Roles, SessionData, ToolbarOptions } from '../models/generals-interfaces';
import { ChartReport } from '../models/report-interfaces';
import { ApexYAxis } from 'apexcharts';
import { crudService, ResponseCrud } from '../models/crud';
import { sign } from 'crypto';
 
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

   public CataloguePermices = signal<Roles[]>([
    {name:'CREATE',active:false}
   ]);

   public FleetPermices = signal<Roles[]>([
    {name:'CREATE',active:false}
   ]);




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
      name: 'selectedGroupVehicle',
        label: 'Grupo',
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
  { title: 'Tipo vehículo', field: 'tsveTypeVehicle', minWidth: 150, headerFilter: 'input' },
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
  } },
  {title:'Rererencia #4',field:'tsQrData', headerFilter: 'input',minWidth: 150}
],
  enableGrid:true
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
      },{
      name: 'selectedGroupVehicle',
        label: 'Grupo',
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
      },
      {
        name: 'GroupDriver',
        label: 'Resumir por conductor',
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

    ],
    enableGrid:true
  },
  {
    name:'Fuel_Measure',
    enableChart:true,
    title:'Comportamiento de tanque',
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

      }
    ],
    columns:[],
    enableGrid:false
  },
  {
      name:'Balance',
      enableChart:false,
      title:'Balance de saldos',
      method: () => {},
      parameters:[
        {
        name: 'EndDate',
        label: 'Fecha  de conciliacion',
        type: 'date',
        enabled: true,
        value: null,
        colClass: 'col-12 col-md-3 col-lg-2'
      }, 
      {
        name: 'selectedDispenser',
        label: 'Inventario',
        type: 'select',
        enabled: true,
        value: '',
        colClass: 'col-12 col-md-3 col-lg-3',
        options: [
          { label: 'Todos', value: '' },
          { label: 'Candelaria', value: 'Candelaria' },
          { label: 'ICSA01', value: 'ICSA01' }
        ]

      }
      ],
      columns:[
         { title: 'Inventario', field: 'tankDescription', minWidth: 180 },
         { title: 'Mes', field: 'month', minWidth: 120,sorter: 'string' },
         { title: 'Saldo Inicial', field: 'initialBalance', sorter: 'number', minWidth: 150 },
         { title: 'Saldo Final', field: 'finalBalance', sorter: 'number', minWidth: 150 },
        
         { title: 'Reabestecimientos', field: 'refuelQuantity', sorter: 'number', minWidth: 150 },
         { title: 'Cont. Reabestecimientos', field: 'refuelCount', sorter: 'number', minWidth: 150 },

        { title: 'Traslados salida', field: 'transferOutQuantity', sorter: 'number', minWidth: 150 },
        { title: 'Traslados salida cont.', field: 'transferOutCount', sorter: 'number', minWidth: 150 },


        { title: 'Traslados a favor', field: 'transferInQuantity', sorter: 'number', minWidth: 150 },
        { title: 'Traslados a favor cont.', field: 'transferInCount', sorter: 'number', minWidth: 150 },
   
        { title: 'Ingresos', field: 'incomeQuantity', sorter: 'number', minWidth: 150 },
        { title: 'Ingresos cont.', field: 'incomeCount', sorter: 'number', minWidth: 150 },
   

        { title: 'Total Ingresos', field: 'totalInputs', sorter: 'number', minWidth: 150 },
        { title: 'Total Salidas', field: 'totalOutputs', sorter: 'number', minWidth: 150 }



      ],
      enableGrid:true
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
        formatter: (val: number, { seriesIndex }) => {
       
          //console.log(seriesIndex)
          return seriesIndex === 0 ? `${(val ?? 0).toFixed(1)}` : `${(val ?? 0).toFixed(2)}`
       
        }
          
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
  },
  {
    name:'Fleet_dashboard',
    chart:{
      series:[],
      xaxis:{categories:[]},
      colors:['#4f46e5', '#d8cb1aff', '#33c858'],
      chart:{
        type:'area',
        stacked:true,
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
      dataLabels:{
        enabled:true
      },
      stroke:{
        curve:'smooth',
 width: [1, 2, 2,2],
      },
      fill:{
        type:'gradient',  
        gradient: {
              opacityFrom: 1,
              opacityTo: 0.8,
            },
      },
      tooltip: {
            fixed: {
              enabled: true,
              position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
              offsetY: 30,
              offsetX: 60,
            },
          },
      legend: {
            horizontalAlign:'center',
            offsetX: 40,
          },
        yaxis:[
             {
              seriesName: 'Cantidad',
              axisTicks: {
                show: true,
              },
              axisBorder: {
                show: true,
                color: '#4f46e5',
              },
              labels: {
                style: {
                  colors: '#4f46e5',
                },
              },
              title: {
                text: 'Cantidad',
                style: {
                  color: '#4f46e5',
                },
              },
              tooltip: {
                enabled: true,
              },
            },
             {
              seriesName: 'Eficiencia',
              opposite: true,
              axisTicks: {
                show: true,
              },
              axisBorder: {
                show: true,
                color: '#d8cb1aff',
              },
              labels: {
                style: {
                  colors: '#d8cb1aff',
                },
              },
              title: {
                text: 'Eficiencia',
                style: {
                  color: '#d8cb1aff',
                },
              },
            },
                {
              seriesName: 'Km - Hrs',
              opposite: true,
              axisTicks: {
                show: true,
              },
              axisBorder: {
                show: true,
                color: '#33c858',
              },
              labels: {
                style: {
                  colors: '#33c858',
                },
              },
              title: {
                text: 'Km - Hrs',
                style: {
                  color: '#33c858',
                },
              },
            }
        ]

  }
},
{
  name:"efficenci_avg",
  chart:{
    series:[],
    chart:{
      type:'area',
      stacked:true,
      sparkline:{
        enabled:true
      }
    },
    stroke:{
      curve:'straight'
    },
    fill:{
      opacity:0.3
    },
    yaxis:{
      min:0
    },
    colors:['#efc313'],
    title:{
      text:'eficieciancia promedio',
      offsetX:0,
      style:{
        fontSize:'24px',
        color:'#2e1d90'
      }
    },
    subtitle:{
      text:'km/gal',
      offsetX:0,
      offsetY:40,
      style:{
        fontSize:'14px',
        color:'#2e1d90'
      }
    }

  }
},
{
  name:'Fuel_Measure',
  chart:{
    series:[],
    xaxis:{type:'datetime'},
    chart:{
      type:'area',
      stacked:false,
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
          enabled:true,
          type:'x',
          autoScaleYaxis:false
        }
    },
    dataLabels:{
      enabled:false
    },
    stroke:{
      curve:'smooth'
    },
    markers:{
      size:0,
    },
    yaxis:{
      min:0,
      forceNiceScale: false
    },
    fill:{
            type: 'gradient',
            colors:['#139bef'],
            gradient: {
              shadeIntensity: 1,
              inverseColors: false,
              opacityFrom: 0.5,
              opacityTo: 0.7,
              stops: [0, 90, 100],
            },
          }
  }
}
];

public toolbarConfig:ToolbarOptions[] = [
  {
    name:'fleet_dashboard',
    options:[
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
      name: 'selectedGroupVehicle',
        label: 'Grupo',
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
        name: 'TransactionsOk',
        label: 'Registros correctos',
        type: 'checkbox',
        enabled: true,
        value: false,
        colClass: 'col-12 col-md-3 col-lg-2'
      }
    ]
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

  };

  GetPostMeasure(sendto:RequestMeasure):Observable<ResultMeasure>{
    const uri = `${this.baseURL}/gsuite/Measuredata`;

    const header = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<ResultMeasure>(uri, sendto, { headers: header });

  }; 



    UpdatePasswordUser(userId:string,password:string): Observable<any> {

    const url = `${this.baseURL}/gsuite/users/${userId}/password`; // Endpoint para actualizar la contraseña

    const body = {password };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(url, body, { headers }); 

  };
  


  CrudMethods(tosend:crudService):Observable<ResponseCrud>{
     const url = `${this.baseURL}/gsuite/CRUD_Methods`;

     const header = new HttpHeaders({
      'Content-Type':'application/json'
     });


     return this.http.post<ResponseCrud>(url,tosend,{headers:header});
     
  };


}
