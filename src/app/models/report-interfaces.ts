type Operation = 'sum' | 'avg' | 'min' | 'max' | 'count';
import {
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
  ApexPlotOptions,
  ApexResponsive,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis
} from 'ng-apexcharts';
import { ReportCatalogue } from './generals-interfaces';
import moment from 'moment-timezone';



export type DynamicChartSeries =
  | ApexAxisChartSeries
  | ApexNonAxisChartSeries;

export interface DynamicChartConfig {
  series: DynamicChartSeries;

  chart: ApexChart;

  labels?: string[];

  colors?: string[];

  title?: ApexTitleSubtitle;

  subtitle?: ApexTitleSubtitle;

  xaxis?: ApexXAxis;

  yaxis?: ApexYAxis | ApexYAxis[];

  stroke?: ApexStroke;

  fill?: ApexFill;

  grid?: ApexGrid;

  legend?: ApexLegend;

  tooltip?: ApexTooltip;

  dataLabels?: ApexDataLabels;

  markers?: ApexMarkers;

  plotOptions?: ApexPlotOptions;

  responsive?: ApexResponsive[];
};


export type ApexSeriesType =
  | 'line'
  | 'area'
  | 'bar'
  | 'column'
  | 'scatter';




interface SummaryField {
    field: string;
    operation: Operation;
}


//nterface de  data grafica
export interface DynamicChartSerie {
  name: string;
  type?: ApexSeriesType;
  data: number[];
}


export function getMonthYear(dateValue: string | Date): string {
  const date = dateValue instanceof Date
    ? dateValue
    : new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return 'Fecha inválida';
  }

  return new Intl.DateTimeFormat('es-GT', {
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Guatemala'
  }).format(date);
}

export function summaryData(
    data: any[],
    groupBy: string[],
    fields: SummaryField[]
): any[] {

    const map = new Map<string, any>();

    for (const row of data) {

        const key = groupBy.map(g => row[g]).join('|');

        if (!map.has(key)) {

            const obj: any = {};

            groupBy.forEach(g => obj[g] = row[g]);

            fields.forEach(f => {

                switch (f.operation) {

                    case 'sum':
                    case 'avg':
                        obj[`${f.field}_${f.operation}`] = 0;
                        break;

                    case 'min':
                        obj[`${f.field}_min`] = Number.MAX_VALUE;
                        break;

                    case 'max':
                        obj[`${f.field}_max`] = Number.MIN_VALUE;
                        break;

                    case 'count':
                        obj[`${f.field}_count`] = 0;
                        break;
                }

            });

            obj.__count = 0;

            map.set(key, obj);
        }

        const current = map.get(key);

        current.__count++;

        fields.forEach(f => {

            const value = Number(row[f.field]) || 0;

            switch (f.operation) {

                case 'sum':
                    current[`${f.field}_sum`] += value;
                    break;

                case 'avg':
                    current[`${f.field}_avg`] += value;
                    break;

                case 'min':
                    current[`${f.field}_min`] = Math.min(current[`${f.field}_min`], value);
                    break;

                case 'max':
                    current[`${f.field}_max`] = Math.max(current[`${f.field}_max`], value);
                    break;

                case 'count':
                    current[`${f.field}_count`]++;
                    break;
            }

        });

    }

    return Array.from(map.values()).map(item => {

        fields
            .filter(f => f.operation === 'avg')
            .forEach(f => {
                item[`${f.field}_avg`] /= item.__count;
            });

        delete item.__count;

        return item;

    });

}


export function createChartSerie<T>(
  source: T[],
  valueField: keyof T,
  name: string,
  type: ApexSeriesType = 'column'
): DynamicChartSerie {

      const data = source.map(item => {
    const value = Number(item[valueField]);

    return Number.isFinite(value)
      ? value
      : 0;
  });

  return {
    name,
    type,
    data
  };
};


export function createChartCategories<T>(
  source: T[],
  categoryField: keyof T
): string[] {

  return source.map(item =>
    String(item[categoryField] ?? '')
  );
}



export interface ReportInterfaces {
    transactionId: string;
    tank:string;
    pump:string;
    product:string;
    fecha: string;
    tagcode: string;
    vehicle:string;
    TypeVehicle:string;
    driver:string;
    odometer:number;
    previusOdometer:number;
    distance:number;   
    hourmeter:number;
    previusHourmeter:number;
    hours:number;
    startcounter:number;
    endcounter:number;
    quantity:number;
}


export interface ChartReport {
    name:string;
    chart:DynamicChartConfig
}



export const EMPTY_CHART_CONFIG: DynamicChartConfig = {
  series: [],

  chart: {
    type: 'line',
    height: 380,
    toolbar: {
      show: true
    },
    zoom: {
      enabled: true
    }
  },

  xaxis: {
    categories: []
  },

  yaxis: {
    min: 0
  },

  dataLabels: {
    enabled: false
  },

  markers: {
    size: 0
  },

  legend: {
    show: true,
    position: 'top',
    horizontalAlign: 'left'
  },

  grid: {
    strokeDashArray: 4
  },

  tooltip: {
    shared: true,
    intersect: false
  }
};


export interface SeriesRule {
     name:string;
     type:string;
     data:number[]
};


export interface FleetDataDashboard{

  chartDataEficiency:DynamicChartConfig;
  chartDataFleet:DynamicChartConfig;
  selectedTable:any[];
  data:any[];
  title:string;
}


type ConvertType = 'number' | 'string' | 'boolean';

export function convertArrayType(
  values: unknown[],
  type: ConvertType
): Array<number | string | boolean> {
  switch (type) {
    case 'number':
      return values.map(value => {
        const converted = Number(value);

        if (Number.isNaN(converted)) {
          return 0;
        }

        return converted;
      });

    case 'boolean':
      return values.map(value => {
        if (typeof value === 'string') {
          return value.toLowerCase() === 'true' || value === '1';
        }

        return Boolean(value);
      });

    case 'string':
    default:
      return values.map(value => String(value));
  }
}

export interface DynamicChartModalData {
  title?: string;
  description?: string;
  chartConfig:DynamicChartConfig;
  width?: string;
  height?: string;
};



//helpers  para reporte 

export function getMonthKey(date: string | Date): string {
  return moment(date)
    .tz('America/Guatemala')
    .format('YYYY-MM');
}''


export function roundQuantity(value: number): number {
  return Number((Number(value) || 0).toFixed(2));
};


export function generateMonthRange(
  startDate: string | Date,
  endDate: string | Date
): string[] {

  const months: string[] = [];

  const current = moment(startDate)
    .tz('America/Guatemala')
    .startOf('month');

  const end = moment(endDate)
    .tz('America/Guatemala')
    .startOf('month');

  while (current.isSameOrBefore(end, 'month')) {
    months.push(current.format('YYYY-MM'));
    current.add(1, 'month');
  }

  return months;
};


export interface MonthlyTankBalance {
  tankDescription: string;
  month: string;

  initialBalance: number;

  refuelQuantity: number;
  refuelCount: number;

  transferOutQuantity: number;
  transferOutCount: number;

  transferInQuantity: number;
  transferInCount: number;

  incomeQuantity: number;
  incomeCount: number;

  totalInputs: number;
  totalOutputs: number;

  finalBalance: number;
};