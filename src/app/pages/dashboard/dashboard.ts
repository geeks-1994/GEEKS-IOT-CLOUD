import { Component, effect, OnInit,signal } from '@angular/core';
import { Tools } from '../../services/tools';
import { Methods } from '../../services/methods';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment-timezone';
import { Miselanuos, ParametersCatalogue, PumpDataDashboard, RequestPayload, resultRegister } from '../../models/generals-interfaces';
import {firstValueFrom} from 'rxjs'
import { createChartCategories, DynamicChartConfig, EMPTY_CHART_CONFIG, FleetDataDashboard, summaryData } from '../../models/report-interfaces';
import { DynamicChart } from '../dynamic-chart/dynamic-chart';
import { GaugeChart } from '../../shared/gauge-chart/gauge-chart';
import { GaugeChartConfig } from '../../models/gauge-chart';
import { CommonModule } from '@angular/common';

type DashboardTab = 'general' | 'fuel' | 'fleet' | 'alerts';

type dataLevel = {
  GaugeChart:GaugeChartConfig;
  title:string;
  volume:number;
  lastUpdate:string;
  product:string;
  capacity:number;
  active:boolean;
  tankId:string;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    DynamicChart,
    GaugeChart,
    CommonModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit{




activeTab = signal<DashboardTab>('general');

TotalGalon = signal<number>(0);
numberRegister = signal<number>(0);
NumberAuditlog = signal<number>(0);
MiselaneousDataTank = signal<Miselanuos[]>([]);

//indicadores

tankGauges = signal<dataLevel[]>([]);


Piechartconfig = signal<DynamicChartConfig>(EMPTY_CHART_CONFIG);
PieProductchartConfig = signal<DynamicChartConfig>(EMPTY_CHART_CONFIG);

FleetDasboard = signal<FleetDataDashboard>({
 chartDataEficiency:EMPTY_CHART_CONFIG,
 chartDataFleet:EMPTY_CHART_CONFIG,
 selectedTable:[],
 data:[] 
});

private dataLoaded = false;
  
constructor(
    public services:Methods,
    public tools:Tools,
    public router:Router,
    public route:ActivatedRoute
    
  ){

    effect( ()=>{
     const ready = this.services.SessionLoaded();
     const session = this.services.SessionData();

         if (!ready || this.dataLoaded) {
      return;
    }

    if (
      !session.userSalesforce ||
      !session.passwordSalesForce ||
      !session.company
    ) {
      return;
    }

    this.dataLoaded = true;
this.getDataGeneral();
this.getDataTanks();
    })

  }


 ngOnInit():void {

const session = this.services.SessionData()

  console.log(session.userSalesforce);
  console.log(session.passwordSalesForce);
  console.log(session.company);
    
  };



 obtenerFechaHoy(): string {
  const hoy = new Date();

  const year = hoy.getFullYear();
  const month = String(hoy.getMonth() + 1).padStart(2, '0');
  const day = String(hoy.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
  

  changeTab(tab: DashboardTab): void {
    this.activeTab.set(tab);
  }



   // helpers para funciones generadoras de datos.


  private toUtcDate(date: string): string {
  return moment(date)
    .tz('America/Guatemala')
    .utc()
    .format('YYYY-MM-DDTHH:mm:ss[Z]');
}

private createNumericSeries(
  records: any[],
  field: string
): number[] {
  return createChartCategories(records, field)
    .map(value => this.toRoundedNumber(value));
}

private toRoundedNumber(
  value: unknown,
  decimals = 2
): number {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  return Number(numericValue.toFixed(decimals));
}

private updateDashboardCounters(
  generalSummary?: any,
  requiredAudit?: any
): void {
  this.TotalGalon.set(
    this.toRoundedNumber(generalSummary?.tsQuantity_sum)
  );

  this.numberRegister.set(
    Number(generalSummary?.tsName_count ?? 0)
  );

  this.NumberAuditlog.set(
    Number(requiredAudit?.tsveVehicleID_count ?? 0)
  );
}



// Muestra el dashboardGeneral.
  async getDataGeneral(): Promise<void> {
  this.tools.loading('Dashboard', 'Consultando ...');

  try {
    const today = this.obtenerFechaHoy();

    const transactionParameters: RequestPayload = {
      tosend: {
        startDate: this.toUtcDate(`${today} 00:00`),
        endDate: this.toUtcDate(`${today} 23:59`),
        tankId: '', 
        vehicleId: '',
        typeVehicle: ''
      },
      user: this.services.SessionData().userSalesforce,
      password: this.services.SessionData().passwordSalesForce,
      company: this.services.SessionData().company,
      group: false,
      excludedFilling: true
    };

    const response: resultRegister = await firstValueFrom(
      this.services.GetPostTransactions(transactionParameters)
    );


    
    const rows: any[] = Array.isArray(response.data)
      ? response.data
      : [];

    const chartTemplate =
      this.services.chartReports.find(
        item => item.name === 'dashboard_pastel'
      )?.chart ?? EMPTY_CHART_CONFIG;

    const generalSummary = summaryData(
      rows,
      ['tscpCompanyID'],
      [
        { field: 'tsQuantity', operation: 'sum' },
        { field: 'tsName', operation: 'count' },
        { field: 'tsveVehicleID', operation: 'count' }
      ]
    )[0];

    const pumpSummary = summaryData(
      rows,
      ['tsppPumpID', 'tspdProductName'],
      [{ field: 'tsQuantity', operation: 'sum' }]
    );

    const productSummary = summaryData(
      rows,
      ['tspdProductName'],
      [{ field: 'tsQuantity', operation: 'sum' }]
    );

    const auditSummary = summaryData(
      rows,
      ['efCheckRequired'],
      [{ field: 'tsveVehicleID', operation: 'count' }]
    );

    const requiredAudit = auditSummary.find(
      item => item.efCheckRequired === true
    );

    this.updateDashboardCounters(generalSummary, requiredAudit);

    this.Piechartconfig.set({
      ...chartTemplate,
      series: this.createNumericSeries(pumpSummary, 'tsQuantity_sum'),
      labels: createChartCategories(pumpSummary, 'tsppPumpID')
    });

    this.PieProductchartConfig.set({
      ...chartTemplate,
      series: this.createNumericSeries(productSummary, 'tsQuantity_sum'),
      labels: createChartCategories(productSummary, 'tspdProductName'),
      title: {
        ...chartTemplate.title,
        text: 'Resumen por producto'
      },
      chart: {
        ...chartTemplate.chart,
        type: 'pie'
      },
      plotOptions: {
        ...chartTemplate.plotOptions,
        pie: {
          ...chartTemplate.plotOptions?.pie,
          donut: {
            ...chartTemplate.plotOptions?.pie?.donut,
            labels: {
              ...chartTemplate.plotOptions?.pie?.donut?.labels,
              total: {
                show: false,
                showAlways: false
              }
            }
          }
        }
      }
    });

  } catch (error) {
    console.error('Error al consultar el dashboard:', error);
    this.tools.toast(
      'No fue posible consultar la información del dashboard',
      'warning',
      'top'
    );
  } finally {
    this.tools.close();
  }
};



async getDataTanks():Promise<void> {

try {
  
  this.tools.loading('Cargando','Cargando ...');
const parameters: ParametersCatalogue = {
        nameObject:'Pumps',
        user: this.services.SessionData().userSalesforce,
        password: this.services.SessionData().passwordSalesForce,
        company: this.services.SessionData().company
      };
      this.tools.loading('Cargando ','actualizando datos ...');

const response:PumpDataDashboard[] = await firstValueFrom(
this.services.GetPostDataCatalogue<PumpDataDashboard>(parameters)
); 
 
 // console.table(response);
let GaujeData:dataLevel[] = response.map((record:PumpDataDashboard) =>{
  
  const instrument:GaugeChartConfig ={
    value:record.tkVolume,
    min:0,
    max:record.tkCapacity,
    label:record.tktankDescription,
    unit:'%',
    decimals:2,
    type:'circle',
    displayValue:'percentage',
    color:'#2089d8'
  }


  const rt:dataLevel ={
     GaugeChart:instrument,
     title:record.tktankDescription,
     lastUpdate:record.tklastActivity,
     volume:record.tkVolume,
     product:record.tkproductName,
     capacity:record.tkCapacity,
     active:true,
     tankId:record.tkTankID      
  }
   return rt;
}) 

this.tankGauges.set(GaujeData);

//console.log(this.tankGauges());
this.tools.close();

} catch (error) {
  this.tools.toast('Error','warning','bottom-start');
}finally{
this.tools.close();
}

};


async FleetDataReport(DataRecord:resultRegister):Promise<void> {

try {
  
  const columns:any[] =[
    { title: 'N# Transaccion', field: 'tsName', sorter: 'string', minWidth: 150,   bottomCalc: 'count',
    bottomCalcFormatter: (cell: any) => {
      return `Registros: ${cell.getValue()}`;
    } },
      { title: 'Vehículo', field: 'tsveVehicleID', minWidth: 150,headerFilter: 'input' },
   { title: 'HRS', field: 'HRS', sorter: 'number', minWidth: 100 },
   { title: 'Distancia', field: 'KM', sorter: 'number', minWidth: 120 },
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

} catch (error) {
  this.tools.warning('Error','verifique la conexion al servidor')
}

}



}
