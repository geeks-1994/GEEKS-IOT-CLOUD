import {
  Component,
  OnInit,
  signal,
  OnDestroy,
  ViewChild,
  ElementRef,
  afterNextRender,
  ChangeDetectorRef,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
  effect 
} from '@angular/core';

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import moment from 'moment-timezone';

import { Methods } from '../../services/methods';
import { Tools } from '../../services/tools';
import { ActivatedRoute, Router } from '@angular/router';

import {
  MeasureData,
  Miselanuos,
  ParametersReport,
  ReportCatalogue,
  ReportName,
  RequestMeasure,
  RequestPayload,
  resultRegister,
  transaction
} from '../../models/generals-interfaces';

import { map, distinctUntilChanged, firstValueFrom } from 'rxjs';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { MiselanousData } from '../../services/miselanous-data';
import { ChartReport, createChartCategories, createChartSerie, DynamicChartConfig, EMPTY_CHART_CONFIG, summaryData } from '../../models/report-interfaces';
import { DynamicChart } from '../dynamic-chart/dynamic-chart';
import { ApexXAxis } from 'apexcharts';
import { ApexAxisChartSeries } from 'ng-apexcharts';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-reports-viewer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    DynamicChart
  ],
  templateUrl: './reports-viewer.html',
  styleUrl: './reports-viewer.scss',
})
export class ReportsViewer implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('tabulatorTable', { static: false })
  tabulatorTable!: ElementRef<HTMLDivElement>;

  private table: any = null;
  private viewReady = false;
  private isBrowser = false;

  reportData = signal<any[]>([]);
  columnsReport = signal<any[]>([]);

  toolbarComponents = signal<ParametersReport[]>([]);
  selectedReport = signal<ReportCatalogue | null>(null);
  chartconfig = signal<DynamicChartConfig>(EMPTY_CHART_CONFIG);


  typeReport: string | null = null;
  titlereport = signal<string>('Reportes');

  MiselaneousDataTank = signal<Miselanuos[]>([]);

  constructor(
    public services: Methods,
    public miselaneousData: MiselanousData,
    public tools: Tools,
    public router: Router,
    public route: ActivatedRoute,
    private cdr:ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    effect(()=>{
this.route.paramMap
      .pipe(
        map(params => params.get('name') as ReportName),
        distinctUntilChanged()
      )
      .subscribe(async (reportName: ReportName) => {
        try {
          this.tools.loading('Cargando datos misceláneos', 'Por favor, espere...');

          await this.miselaneousData.loadDataMiselaous();

          this.loadReport(reportName);

            this.cdr.detectChanges();
             this.tryCreateOrUpdateTable();
        

        } catch (error) {
          console.error('Error al cargar reporte:', error);
        } finally {
          this.tools.close();
        }
      });
    })
  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.tryCreateOrUpdateTable();
  }

  ngOnDestroy(): void {

    this.destroyTable();
  }

loadReport(reportName: ReportName): void {

  const report = this.services.reports.find(
    r => r.name === reportName
  );

  const chartConfigTool = this.services.chartReports.find(
    item => item.name === reportName
  );

  if (!report) {

    console.error(
      'Report not found:',
      reportName
    );

    this.toolbarComponents.set([]);
    this.selectedReport.set(null);
    this.typeReport = null;
    this.columnsReport.set([]);

    this.destroyTable();

    return;
  }

  // =====================================================
  // IMPORTANTE
  // =====================================================

  if (!report.enableGrid) {
    this.destroyTable();
  }

  this.selectedReport.set(report);

  this.typeReport = report.name;

  this.titlereport.set(
    report.title
  );

  this.chartconfig.set(
    chartConfigTool?.chart ??
    EMPTY_CHART_CONFIG
  );

  this.columnsReport.set(
    report.columns || []
  );

  const enabledParameters =
    report.parameters
      .filter(parameter =>
        parameter.enabled
      )
      .map(parameter => {

        let options: Miselanuos[] = [];

        if (
          parameter.name ===
          'selectedDispenser'
        ) {

          options =
            this.miselaneousData
              .miselanousDataTank();
        }

        if (
          parameter.name ===
          'selectedVehicle'
        ) {

          options =
            this.miselaneousData
              .miselanousDataVehicle();
        }

        if (
          parameter.name ===
          'selectedTypeVehicle'
        ) {

          options =
            this.miselaneousData
              .miselanousDataVehicleBrand();
        }

        if (
          parameter.name ===
          'selectedGroupVehicle'
        ) {

          options =
            this.miselaneousData
              .MiselanousDataGroup();
        }

        return {
          ...parameter,
          options,

          value:
            parameter.value ??
            this.getDefaultValue(
              parameter.type
            )
        };
      });

  this.toolbarComponents.set(
    enabledParameters
  );
}

  private async tryCreateOrUpdateTable(): Promise<void> {
    if (!this.isBrowser) return;
    if (!this.viewReady) return;
    if (!this.tabulatorTable?.nativeElement) return;

    const columns = this.columnsReport();

    if (!columns || columns.length === 0) {
      console.warn('Tabulator aún no se crea porque no hay columnas cargadas.');
      return;
    }

    if (!this.table) {
      await this.createTable();
      return;
    }

    this.table.setColumns(columns);
    this.table.setData(this.reportData());
    this.table.redraw(true);
  }

  private async createTable(): Promise<void> {
    if (!this.isBrowser) return;
    if (!this.tabulatorTable?.nativeElement) return;

    const { TabulatorFull } = await import('tabulator-tables');

    this.table = new TabulatorFull(this.tabulatorTable.nativeElement, {
     
      dependencies:{
        XLSX:XLSX
      },
      data: this.reportData(),
      layout: 'fitColumns',

      height: '520px',

      pagination: true,
      paginationSize: 15,
      paginationSizeSelector: [10, 15, 25, 50, 100],

      movableColumns: true,
      resizableColumnFit: true,

      placeholder: 'No hay datos para mostrar',

      columns: this.columnsReport()
    });
  }

  getDefaultValue(type: string): any {
    switch (type) {
      case 'checkbox':
        return false;

      case 'date':
      case 'DateTime':
      case 'datetime':
        return null;

      default:
        return '';
    }
  }

  updateParameterValue(parameterName: string, value: any): void {
    this.toolbarComponents.update(parameters =>
      parameters.map(parameter => {
        if (parameter.name !== parameterName) return parameter;
        if (parameter.readonly) return parameter;

        return {
          ...parameter,
          value
        };
      })
    );
  }

  getToolbarValues(): Record<string, any> {
    return this.toolbarComponents().reduce((acc, parameter) => {
      acc[parameter.name] = parameter.value;
      return acc;
    }, {} as Record<string, any>);
  }

  async runReport(): Promise<void> {
    const report = this.selectedReport();

    if (!report) {
      console.error('No hay reporte seleccionado');
      return;
    }

    const parameters = this.getToolbarValues();
   console.log(parameters);
    console.log('Ejecutando reporte:', report.name);

    if (report.name === 'raw_data') {
    

  try {

    await  this.GenerateRaw();    

  } catch (error) {
    this.tools.error('Error en cargar los datos','Verifique su conexion a red')
  }

    }else if(report.name === 'summary_data'){

      await this.ResumeData();
    }else if(report.name === 'Fuel_Measure'){

      await this.LevelData();

    }
  
  }

  clearToolbar(): void {
    this.toolbarComponents.update(parameters =>
      parameters.map(parameter => ({
        ...parameter,
        value: this.getDefaultValue(parameter.type)
      }))
    );
  }

  refreshTable(): void {
    this.table?.setData(this.reportData());
    this.table?.redraw(true);
  }

 async downloadExcel():Promise<void> {

  if (!this.table) {

    console.warn(
      'Tabulator aún no está inicializado'
    );

    this.tools.warning(
      'Reporte',
      'El reporte aun no esta cargado'
    );

    return;
  }

  const response = await this.tools.question('Excel','Desea descargar este reporte ...');

  if(response.isConfirmed){
  this.table.download(
    'xlsx',
    `${this.titlereport()}.xlsx`,
    {
      sheetName: 'sheet1',

      documentProcessing: (workbook: any) => {

        const sheet =
          workbook.Sheets['sheet1'];

        if (!sheet || !sheet['!ref']) {
          return workbook;
        }

        const range =
          XLSX.utils.decode_range(
            sheet['!ref']
          );

        const columnWidths: any[] = [];

        // =====================================
        // AUTOAJUSTAR COLUMNAS
        // =====================================

        for (
          let col = range.s.c;
          col <= range.e.c;
          col++
        ) {

          let maxLength = 10;

          for (
            let row = range.s.r;
            row <= range.e.r;
            row++
          ) {

            const cellAddress =
              XLSX.utils.encode_cell({
                r: row,
                c: col
              });

            const cell =
              sheet[cellAddress];

            if (!cell) {
              continue;
            }

            const value =
              String(cell.v ?? '');

            maxLength =
              Math.max(
                maxLength,
                value.length
              );
          }

          columnWidths.push({
            wch: Math.min(
              maxLength + 3,
              50
            )
          });
        }

        sheet['!cols'] =
          columnWidths;


        // =====================================
        // ESTILO DEL HEADER
        // =====================================

        const headerRow =
          range.s.r;

        for (
          let col = range.s.c;
          col <= range.e.c;
          col++
        ) {

          const cellAddress =
            XLSX.utils.encode_cell({
              r: headerRow,
              c: col
            });

          const cell =
            sheet[cellAddress];

          if (!cell) {
            continue;
          }

          cell.s = {

            font: {
              bold: true,

              color: {
                rgb: 'FFFFFF'
              }
            },

            fill: {
              patternType: 'solid',

              fgColor: {
                rgb: '334155'
              }
            },

            alignment: {
              horizontal: 'center',
              vertical: 'center'
            },

            border: {

              top: {
                style: 'thin',
                color: {
                  rgb: 'D1D5DB'
                }
              },

              bottom: {
                style: 'thin',
                color: {
                  rgb: 'D1D5DB'
                }
              },

              left: {
                style: 'thin',
                color: {
                  rgb: 'D1D5DB'
                }
              },

              right: {
                style: 'thin',
                color: {
                  rgb: 'D1D5DB'
                }
              }
            }
          };
        }

        return workbook;
      }
    }
  );
  }


};

  getFilteredOptions(parameter: any): Miselanuos[] {
    const options: Miselanuos[] = parameter.options || [];

    const searchValue = String(parameter.value || '').toLowerCase().trim();

    if (!searchValue) {
      return options;
    }

    return options.filter((option) =>
      String(option.label).toLowerCase().includes(searchValue) ||
      String(option.value).toLowerCase().includes(searchValue)
    );
  }

  getOptionLabel(parameter: any): string {
    const options: Miselanuos[] = parameter.options || [];

    const selectedOption = options.find(
      (option) => option.value === parameter.value
    );

    return selectedOption ? selectedOption.label : String(parameter.value || '');
  }


  private destroyTable(): void {

  if (!this.table) {
    return;
  }

  try {

    this.table.destroy();

  } catch (error) {

    console.warn(
      'Error destruyendo Tabulator:',
      error
    );

  }
  this.table = null;
}

  //Reportes generados

async GenerateRaw(){

      const parameters = this.getToolbarValues();

      const Startdate = this.tools.formatDate(parameters['StartDate']) + ' ' + '00:00';
      const Enddate = this.tools.formatDate(parameters['EndDate']) + ' ' + '23:59'; 
            const transactionParameters: RequestPayload = {
        tosend: {
          startDate: moment(Startdate).tz('America/Guatemala').utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
          endDate: moment(Enddate).tz('America/Guatemala').utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
          tankId: parameters['selectedDispenser'] || '',
          vehicleId: parameters['selectedVehicle'] || '',
          typeVehicle: parameters['selectedTypeVehicle'] || '',
          groupVehicle:parameters['selectedGroupVehicle'] || ''
        },
        user: this.services.SessionData().userSalesforce,
        password: this.services.SessionData().passwordSalesForce,
        company: this.services.SessionData().company,
        group: parameters['GroupTransactions'] || false,
        excludedFilling: false
      };

      this.tools.loading('Generando reporte','Consultando ...');
      console.log('Parametros de transaccion:', transactionParameters);
      const dataresponse: resultRegister = await firstValueFrom(
        this.services.GetPostTransactions(transactionParameters)
      );

      
      const rows: any[] = Array.isArray(dataresponse.data)
        ? dataresponse.data
        : [];

        const formatData = rows.map((record:transaction) =>({
          ...record,
          tsDateRefuel: moment(record.tsDateRefuel).tz('America/Guatemala').format('YYYY-MM-DD HH:mm'),
          tsHourometer: parseFloat(Number(record.tsHourometer).toFixed(1)),
          tsQuantity:parseFloat(Number(record.tsQuantity).toFixed(1))
        }));
      //console.log('Datos reporte:', rows);

      this.reportData.set(formatData);

      await this.tryCreateOrUpdateTable();

      this.table?.setData(formatData);
      this.table?.redraw(true);   
      this.tools.close();
};

async ResumeData(){

  try {
      const parameters = this.getToolbarValues();

      const Startdate = this.tools.formatDate(parameters['StartDate']) + ' ' + '00:00';
      const Enddate = this.tools.formatDate(parameters['EndDate']) + ' ' + '23:59'; 
            const transactionParameters: RequestPayload = {
        tosend: {
          startDate: moment(Startdate).tz('America/Guatemala').utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
          endDate: moment(Enddate).tz('America/Guatemala').utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
          tankId: parameters['selectedDispenser'] || '',
          vehicleId: parameters['selectedVehicle'] || '',
          typeVehicle: parameters['selectedTypeVehicle'] || '',
          groupVehicle:parameters['selectedGroupVehicle'] || ''
        },
        user: this.services.SessionData().userSalesforce,
        password: this.services.SessionData().passwordSalesForce,
        company: this.services.SessionData().company,
        group: parameters['GroupTransactions'] || false,
        excludedFilling: false
      };

        const summaryDriver:boolean = parameters['GroupDriver'];

      this.tools.loading('Generando reporte','Consultando ...');
       const dataresponse: resultRegister = await firstValueFrom(
        this.services.GetPostTransactions(transactionParameters)
      );

            const rows: any[] = Array.isArray(dataresponse.data)
        ? dataresponse.data
        : [];

        const formatData = rows.map((record:transaction) =>({
          ...record,
          tsDateRefuel: moment(record.tsDateRefuel).tz('America/Guatemala').format('YYYY-MM-DD HH:mm'),
          tsHourometer: parseFloat(Number(record.tsHourometer).toFixed(1)),
          tsQuantity:parseFloat(Number(record.tsQuantity).toFixed(2)),
          KM:parseFloat(Number(record.KM).toFixed(2)),
          HRS:parseFloat(Number(record.HRS).toFixed(2))
        }));

        const distinct = summaryDriver === true ? 'tsdvDriverName' : 'tsveVehicleID'

        const resume = summaryData(formatData,[distinct,"tsveTypeVehicle"],
          [{field:'tsQuantity',operation:'sum'},
            {field:'KM',operation:'sum'},
            {field:'HRS',operation:'sum'},
            {field:'eficiency',operation:'avg'},
            {field:'tstgTagID',operation:'count'}
          ]);


          const resumeData = resume.map((record:any) => ({
            ...record,
            HRS_sum:parseFloat(Number(record.HRS_sum).toFixed(2)),
            KM_sum:parseFloat(Number(record.KM_sum).toFixed(2)),
            eficiency_avg:parseFloat(Number(record.eficiency_avg).toFixed(2)),
            tsQuantity_sum:parseFloat(Number(record.tsQuantity_sum).toFixed(2))
          }))
          console.log(resume);


          const seriesQuantity = createChartSerie<any>(resumeData,'tsQuantity_sum','Cantidad','column');
          const seriesEficienci = createChartSerie<any>(resumeData,'eficiency_avg','Eficiencia','line');
          const dataSeriesChart:ApexAxisChartSeries = [seriesQuantity,seriesEficienci];
          const categories = createChartCategories(resumeData,distinct);

          if(summaryDriver === true){
            this.columnsReport.update(colums =>[
              {
                ...colums[0],
                title:"Conductor",
                field:"tsdvDriverName",
                minWidth: 150,headerFilter: 'input'
              },
              ...colums.slice(1)
            ])
          }else if(summaryDriver === false){
            this.columnsReport.update(colums =>[
              { title: 'Vehículo', field: 'tsveVehicleID', minWidth: 150,headerFilter: 'input' },
              ...colums.slice(1)
            ])
          }


this.chartconfig.update( config =>({
  ...config,
  series:dataSeriesChart,
  xaxis:{
    ...(config.xaxis ?? {}),
    categories
  }
}))



this.reportData.set(resumeData);
await this.tryCreateOrUpdateTable();
this.table?.setData(resumeData);
this.table?.redraw(true);
 this.tools.close();


  } catch (error) {
 this.tools.error('Error de servidor','Verifique la conexion ...');   
  }

}

async LevelData(){
 
  this.tools.loading('Generando reporte','Consultando ...');

  try {
  const parameters = this.getToolbarValues();

      const Startdate = this.tools.formatDate(parameters['StartDate']) + ' ' + '00:00';
      const Enddate = this.tools.formatDate(parameters['EndDate']) + ' ' + '23:59';
      
      const measureParameters: RequestMeasure = {

        tosend:{
           startDate: moment(Startdate).tz('America/Guatemala').utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
          endDate: moment(Enddate).tz('America/Guatemala').utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
          tankId: parameters['selectedDispenser'] || '',
        },
       user: this.services.SessionData().userSalesforce,
        password: this.services.SessionData().passwordSalesForce,
        company: this.services.SessionData().company,
      }
     
       const response = await firstValueFrom(
      this.services.GetPostMeasure(measureParameters)
    );
      
        const rows:any[] = Array.isArray(response.data) ? response.data : [];
        const formatdata = rows.map((record:MeasureData)=>({
         ... record,
         tsDateMeasure:moment(record.tsDateMeasure)
            .tz('America/Guatemala')
            .format('YYYY-MM-DD HH:mm')
        }));

            const SeriesData:any = formatdata.map((record:MeasureData) => {
        
              return {
                date: record.tsDateMeasure,
                value:record.tsQuantity
              }
            });
        
            console.log(SeriesData);
            const MeasureDateSeries = createChartCategories(formatdata,'tsDateMeasure');
          
            const DataLevel = createChartSerie(formatdata,'tsQuantity','Volumen','area');
        
             const SeriesLevel = [DataLevel];

     this.chartconfig.update(current =>({
       ... current,
       series:SeriesLevel,
       title:{
        text:`Sensor: ${measureParameters.tosend.tankId}`,
        align:'center'
       },
       xaxis:{
        categories:MeasureDateSeries
       }
     }))
     this.tools.close(); 
  } catch (error) {
    this.tools.close();
     this.tools.error('Error de servidor','Verifique la conexion ...');
  }

}

}