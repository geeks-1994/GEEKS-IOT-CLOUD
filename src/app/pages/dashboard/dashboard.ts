import { Component, effect, OnInit,signal } from '@angular/core';
import { Tools } from '../../services/tools';
import { Methods } from '../../services/methods';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment-timezone';
import { EMPTY_TOOLBAR_OPTIONS, MeasureData, Miselanuos, ParametersCatalogue, PumpDataDashboard, RequestMeasure, RequestPayload, resultRegister, ToolbarOptions, transaction } from '../../models/generals-interfaces';
import {firstValueFrom} from 'rxjs'
import { convertArrayType, createChartCategories, createChartSerie, DynamicChartConfig, DynamicChartModalData, EMPTY_CHART_CONFIG, FleetDataDashboard, summaryData } from '../../models/report-interfaces';
import { DynamicChart } from '../dynamic-chart/dynamic-chart';
import { GaugeChart } from '../../shared/gauge-chart/gauge-chart';
import { GaugeChartConfig } from '../../models/gauge-chart';
import { CommonModule } from '@angular/common';
import { ApexAxisChartSeries } from 'apexcharts';
import { FleetDashboard } from '../../shared/fleet-dashboard/fleet-dashboard';
import { ToolBar } from '../../shared/tool-bar/tool-bar';
import {DynamicChartModal} from '../../shared/dynamic-chart-modal/dynamic-chart-modal'
import { MiselanousData } from '../../services/miselanous-data';
import { MatDialog } from '@angular/material/dialog';

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
  DateMeasured:string;
};

@Component({
  selector: 'app-dashboard',
  imports: [
    DynamicChart,
    GaugeChart,
    CommonModule,
    FleetDashboard,
    ToolBar,
    DynamicChartModal
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit{




activeTab = signal<DashboardTab>('general');
toolbarFleet = signal<ToolbarOptions>(EMPTY_TOOLBAR_OPTIONS);
TotalGalon = signal<number>(0);
numberRegister = signal<number>(0);
NumberAuditlog = signal<number>(0);
MiselaneousDataTank = signal<Miselanuos[]>([]);

//indicadores

tankGauges = signal<dataLevel[]>([]);


Piechartconfig = signal<DynamicChartConfig>(EMPTY_CHART_CONFIG);
PieProductchartConfig = signal<DynamicChartConfig>(EMPTY_CHART_CONFIG);
ChartFuelLevel = signal<DynamicChartConfig>(EMPTY_CHART_CONFIG);

FleetDasboard = signal<FleetDataDashboard>({
 chartDataEficiency:EMPTY_CHART_CONFIG,
 chartDataFleet:EMPTY_CHART_CONFIG,
 selectedTable:[],
 data:[],
 title:'Detalle de consumo' 
});

private dataLoaded = false;
  
constructor(
    public services:Methods,
    public tools:Tools,
    public router:Router,
    public route:ActivatedRoute,
    public miselaneous:MiselanousData,
    private dialog:MatDialog
    
  ){

    effect( async ()=>{
     const ready = this.services.SessionLoaded();
     const session = this.services.SessionData();
     const dataTool = this.services.toolbarConfig.find(item => item.name === 'fleet_dashboard');
     const MeasureLevel = this.services.chartReports.find(item => item.name === 'Fuel_Measure');
     await miselaneous.loadDataMiselaous();
     
const filterData: ToolbarOptions = dataTool
  ? {
      name: dataTool.name,
      options: dataTool.options
        .filter(parameter => parameter.enabled)
        .map(parameter => {
          let options: Miselanuos[] =  [];

          if (parameter.name === 'selectedTypeVehicle') {
            options =
              this.miselaneous.miselanousDataVehicleBrand();
          }else if( parameter.name === 'selectedTypePerformance'){
           options = [
          { label: 'Todos', value: '' },
          { label: 'Horas', value: 'Hr' },
          { label: 'Kilómetros', value: 'Km' }
        ]
          } else if(parameter.name === 'selectedGroupVehicle'){
             options = this.miselaneous.MiselanousDataGroup();
          }

          return {
            ...parameter,
            options,
            value:
              parameter.value ??
              this.getDefaultValue(parameter.type)
          };
        })
    }
  : EMPTY_TOOLBAR_OPTIONS;


     this.toolbarFleet.set(filterData ?? EMPTY_TOOLBAR_OPTIONS);
     this.ChartFuelLevel.set(MeasureLevel?.chart ?? EMPTY_CHART_CONFIG); 

     console.log('Toolbar Fleet Config:', this.toolbarFleet());

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

  // console.log(session.userSalesforce);
  // console.log(session.passwordSalesForce);
  // console.log(session.company);
    
  };

 getDefaultValue(type: string): any {
    switch (type?.toLowerCase()) {
      case 'checkbox':
        return false;

      case 'date':
      case 'datetime':
        return null;

      default:
        return '';
    }
  }

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
      group: true,
      excludedFilling:false
    };


    console.log('Parametros de transaccion:', transactionParameters);
    const response: resultRegister = await firstValueFrom(
      this.services.GetPostTransactions(transactionParameters)
    );


 await  this.FleetDataReport(response);


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
     tankId:record.tkTankID,
     DateMeasured:moment(record.tklastActivity).tz('America/Guatemala').format('YYYY-MM-DD HH:mm') ?? ''      
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

async LevelData(tankId:string,tankDescription:string = ''):Promise<void>{
 this.tools.loading('Nivel de Tanque','Cargando ...')
try {
        const today = this.obtenerFechaHoy();

    const transactionParameters: RequestMeasure = {
      tosend: {
        startDate: this.toUtcDate(`${today} 00:00`),
        endDate: this.toUtcDate(`${today} 23:59`),
        tankId: tankId
      },
      user: this.services.SessionData().userSalesforce,
      password: this.services.SessionData().passwordSalesForce,
      company: this.services.SessionData().company
    };


    console.log(transactionParameters);
    const response = await firstValueFrom(
      this.services.GetPostMeasure(transactionParameters)
    );

    const rows:any[] = Array.isArray(response.data) ? response.data : [];
    const formatdata = rows.map((record:MeasureData)=>({
     ... record,
     tsDateMeasure:moment(record.tsDateMeasure)
        .tz('America/Guatemala')
        .format('YYYY-MM-DD HH:mm')
    }))
//  console.log(formatdata);

    const SeriesData:any = formatdata.map((record:MeasureData) => {

      return {
        date: record.tsDateMeasure,
        value:record.tsQuantity
      }
    });

    console.log(SeriesData);
    const MeasureDateSeries = createChartCategories(formatdata,'tsDateMeasure');
    const Measuretype = convertArrayType(MeasureDateSeries,'string'); 

    const DataLevel = createChartSerie(formatdata,'tsQuantity','Volumen','area');

     const SeriesLevel = [DataLevel];
     

     this.ChartFuelLevel.update(current =>({
       ... current,
       series:SeriesLevel,
       title:{
        text:`Sensor: ${tankDescription}`,
        align:'center'
       },
       xaxis:{
        categories:MeasureDateSeries
       }
     }));


     this.openchartModal(this.ChartFuelLevel());

this.tools.close();
} catch (error) {


  this.tools.toast('Error','error','top')
  this.tools.close();
}

}



async FleetDataReport(DataRecord: resultRegister,RegisterOk: boolean = true ):  Promise<void> {
  
  try {

    const chartConfigOne = this.services.chartReports.find(
      item => item.name === 'efficenci_avg'
    );

    const chartConfigTwo = this.services.chartReports.find(
      item => item.name === 'Fleet_dashboard'
    );

    const columns: any[] = [
      {
        title: 'N# Transacción',
        field: 'tsName',
        sorter: 'string',
        minWidth: 150,
        bottomCalc: 'count',
        bottomCalcFormatter: (cell: any) => {
          return `Registros: ${cell.getValue()}`;
        }
      },
      {
        title: 'Vehículo',
        field: 'tsveVehicleID',
        minWidth: 150,
        headerFilter: 'input'
      },
      {
        title: 'HRS',
        field: 'HRS',
        sorter: 'number',
        minWidth: 100
      },
      {
        title: 'Distancia',
        field: 'KM',
        sorter: 'number',
        minWidth: 120
      },
      {
        title: 'Cantidad',
        field: 'tsQuantity',
        sorter: 'number',
        minWidth: 120,
        bottomCalc: 'sum',
        bottomCalcFormatter: (cell: any) => {
          const value = Number(cell.getValue() || 0);
          return value.toFixed(2);
        }
      },
      {
        title: 'Eficiencia',
        field: 'eficiency',
        sorter: 'number',
        minWidth: 120,
        bottomCalc: 'avg',
        bottomCalcFormatter: (cell: any) => {
          const value = Number(cell.getValue() || 0);
          return value.toFixed(2);
        }
      }
    ];

    const rows: transaction[] = Array.isArray(DataRecord.data)
      ? DataRecord.data
      : [];

    let formatData = rows.map((record: transaction) => ({
      ...record,

      tsDateRefuel: moment(record.tsDateRefuel)
        .tz('America/Guatemala')
        .format('YYYY-MM-DD HH:mm'),

      tsHourometer: Number(
        Number(record.tsHourometer || 0).toFixed(1)
      ),

      tsQuantity: Number(
        Number(record.tsQuantity || 0).toFixed(2)
      ),

      KM: Number(
        Number(record.KM || 0).toFixed(2)
      ),

      HRS: Number(
        Number(record.HRS || 0).toFixed(2)
      ),

      eficiency: Number(
        Number(record.eficiency || 0).toFixed(2)
      )
    }));
    

    const auditLog = formatData.filter(record => record.efCheckRequired == true);


     if(RegisterOk == true){
           formatData = formatData.filter(record => record.efCheckRequired == false); 
     }



    // Series para las gráficas
    const seriesQuantity = createChartSerie<any>(
      formatData,
      'tsQuantity',
      'Cantidad',
      'column'
    );

    const seriesEfficiency = createChartSerie<any>(
      formatData,
      'eficiency',
      'Eficiencia',
      'line'
    );

    const thirdSerie = createChartSerie<any>(
      formatData,
      'KM',
      'Distancia',
      'area'
    );

    // Categorías del eje X
    const categories = createChartCategories(
      formatData,
      'tsveVehicleID'
    );

     //sparline series
     const categorySpark = createChartCategories(formatData,'eficiency'); 
     const categorySparkformat:any = convertArrayType(categorySpark,'number');
     const avgEficiency = summaryData(formatData,['tscpCompanyID'],[{ field: 'eficiency', operation: 'avg' }])[0];

     console.log('Promedio de eficiencia:', avgEficiency?.eficiency_avg);
    const dataChartSeries: ApexAxisChartSeries = [
      seriesQuantity,
      seriesEfficiency
    ];

    const sparlineSeries = [{data:categorySparkformat}];
    const dataChartSeriesFleet: ApexAxisChartSeries = [
      seriesQuantity,
      seriesEfficiency,
      thirdSerie
    ];

    /*
     * Se crea una nueva referencia para ChartOne.
     * Esto evita modificar directamente la configuración
     * almacenada dentro de chartReports.
     */
    const ChartOne = {
      ...(chartConfigOne?.chart ?? EMPTY_CHART_CONFIG),
      series:sparlineSeries,
      title:{
          text:`km*gls: ${avgEficiency?.eficiency_avg.toFixed(2)}`,
            offsetX: 0,
            style: {
              fontSize: '38px',
            },
      }
    };


     /*
     * ChartTwo se conserva sin modificaciones,
     * tal como lo necesitas para las pruebas.
     */
    const ChartTwo ={
      ...(      chartConfigTwo?.chart ?? EMPTY_CHART_CONFIG),
      series: dataChartSeriesFleet,
      xaxis: {
        ...(chartConfigTwo?.chart?.xaxis ?? {}),
        categories
    }
  }

    
    
    this.FleetDasboard.update(current => ({
      ...current,
      chartDataEficiency: ChartOne,
      chartDataFleet: ChartTwo,
      selectedTable: columns,
      data: auditLog
    }));

    console.log(
      'FleetDashboard actualizado:',
      this.FleetDasboard()
    );

    console.log(
      'Series Fleet disponibles para pruebas:',
      dataChartSeriesFleet
    );
  } catch (error) {
    console.error('Error en FleetDataReport:', error);

    this.tools.warning(
      'Error',
      'Verifique la conexión al servidor'
    );
  }
};


openchartModal(chartconfig:DynamicChartConfig){

  const data:DynamicChartModalData ={
    title:"Comportamiento de Tanque",
    description:"Datos del sensor",
    chartConfig:chartconfig
  }


  this.dialog.open(DynamicChartModal,{

          width: '92vw',
      maxWidth: '1100px',
      maxHeight: '90vh',
      autoFocus: false,
      restoreFocus: true,
      panelClass: 'dynamic-chart-dialog',
      data
  })

}


onToolbarValuesChange(values: Record<string, any>): void {
  console.log('Valores modificados:', values);
}

async generateReport(values: Record<string, any>): Promise<void> {
  console.log('Generar reporte con:', values);

  try {
       this.tools.loading('Generando reporte', 'Procesando datos...');
      const today = this.obtenerFechaHoy();

    const transactionParameters: RequestPayload = {
      tosend: {
        startDate: this.toUtcDate(`${today} 00:00`),
        endDate: this.toUtcDate(`${today} 23:59`),
        tankId: '', 
        vehicleId: '',
        typeVehicle: values['selectedTypeVehicle'] ?? '',
        groupVehicle:values['selectedGroupVehicle'] ?? ''
      },
      user: this.services.SessionData().userSalesforce,
      password: this.services.SessionData().passwordSalesForce,
      company: this.services.SessionData().company,
      group:true,
      excludedFilling:false
    };
    console.log('Parametros de transaccion para reporte:', transactionParameters);

    const response: resultRegister = await firstValueFrom(
      this.services.GetPostTransactions(transactionParameters)
    );


     await this.FleetDataReport(response,values['TransactionsOk'] ?? false);
     this.tools.close();
  } catch (error) {
    this.tools.close();
    this.tools.warning(
      'Error',
      'No fue posible generar el reporte. Verifique la conexión al servidor.'
    );
    console.error('Error al generar el reporte:', error);
  }

}

onToolbarCleared(): void {
  console.log('Toolbar limpiado');
}



}
