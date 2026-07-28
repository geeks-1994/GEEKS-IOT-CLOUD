import { Component,input,ChangeDetectionStrategy,computed } from '@angular/core';
import {NgApexchartsModule} from 'ng-apexcharts';
import {DynamicChartConfig} from '../../models/report-interfaces'


@Component({
  selector: 'app-dynamic-chart',
  imports: [
    NgApexchartsModule
  ],
  templateUrl: './dynamic-chart.html',
  styleUrl: './dynamic-chart.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class DynamicChart {

//configuracion recibida desde el componente padre
  config = input.required<DynamicChartConfig>();


  /**
   * Normaliza la configuración y agrega valores predeterminados.
   */
  chartConfig = computed<DynamicChartConfig>(() => {
    const config = this.config();

    return {
      ...config,

      chart: {
        height: 350,
        toolbar: {
          show: true
        },
        zoom: {
          enabled: true
        },
        animations: {
          enabled: true,
          speed: 700
        },
        ...config.chart
      },

      dataLabels: {
        enabled: false,
        ...config.dataLabels
      },

      legend: {
        show: true,
        position: 'bottom',
        horizontalAlign: 'center',
        ...config.legend
      },

      grid: {
        borderColor: '#e5e7eb',
        strokeDashArray: 4,
        ...config.grid
      },

      tooltip: {
        enabled: true,
        ...config.tooltip
      },

      stroke: {
        width: 3,
        curve: 'smooth',
        ...config.stroke
      },

      fill: {
        opacity: 1,
        ...config.fill
      }
    };
  });

}
