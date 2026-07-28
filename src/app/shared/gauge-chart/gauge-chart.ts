import { Component,computed,input,ChangeDetectionStrategy } from '@angular/core';

import {
  ApexChart,
  ApexFill,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexStroke,
  NgApexchartsModule
} from 'ng-apexcharts'

import {
GaugeChartConfig
} from '../../models/gauge-chart';




export interface GaugeApexOptions {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  stroke: ApexStroke;
  labels: string[];
  colors: string[];
}


@Component({
  selector: 'app-gauge-chart',
  standalone:true,
  imports: [
    NgApexchartsModule
  ],
  templateUrl: './gauge-chart.html',
  styleUrl: './gauge-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class GaugeChart {


  /**
   * Configuración recibida desde el componente padre.
   */
  readonly config = input.required<GaugeChartConfig>();

  /**
   * Valor mínimo normalizado.
   */
  readonly minValue = computed(() => {
    return this.toNumber(this.config().min, 0);
  });

  /**
   * Valor máximo normalizado.
   */
  readonly maxValue = computed(() => {
    const min = this.minValue();
    const max = this.toNumber(this.config().max, 100);

    return max > min ? max : min + 1;
  });

  /**
   * Valor actual limitado al rango configurado.
   */
  readonly normalizedValue = computed(() => {
    const value = this.toNumber(
      this.config().value,
      this.minValue()
    );

    return Math.min(
      Math.max(value, this.minValue()),
      this.maxValue()
    );
  });

  /**
   * ApexCharts radialBar trabaja normalmente con porcentajes.
   * Convertimos el valor real a un rango de 0 a 100.
   */
  readonly percentage = computed(() => {
    const min = this.minValue();
    const max = this.maxValue();
    const value = this.normalizedValue();

    const percentage = (
      (value - min) /
      (max - min)
    ) * 100;

    return Math.min(
      Math.max(percentage, 0),
      100
    );
  });

  /**
   * Configuración completa de ApexCharts.
   */
  readonly chartOptions = computed<GaugeApexOptions>(() => {
    const config = this.config();
    const isSemiCircle = config.type === 'semi-circle';

    const startAngle = isSemiCircle ? -90 : -135;
    const endAngle = isSemiCircle ? 90 : 135;

    return {
      series: [
        Number(this.percentage().toFixed(2))
      ],

      chart: {
        type: 'radialBar',
        height: config.height ?? 280,
        sparkline: {
          enabled: true
        },
        animations: {
          enabled: config.animations ?? true,
          speed: 700,
          animateGradually: {
            enabled: true,
            delay: 100
          },
          dynamicAnimation: {
            enabled: true,
            speed: 500
          }
        }
      },

      colors: [
        config.color ?? '#2563eb'
      ],

      plotOptions: {
        radialBar: {
          startAngle,
          endAngle,

          hollow: {
            size: isSemiCircle ? '58%' : '62%'
          },

          track: {
            background: config.trackColor ?? '#e8edf3',
            strokeWidth: '100%',
            margin: 4
          },

          dataLabels: {
            name: {
              show: true,
              fontSize: '14px',
              fontWeight: 500,
              offsetY: isSemiCircle ? 20 : 22
            },

            value: {
              show: true,
              fontSize: '27px',
              fontWeight: 700,
              offsetY: isSemiCircle ? -18 : -18,

              formatter: () => {
                return this.getFormattedValue();
              }
            }
          }
        }
      },

      fill: {
        type: 'solid'
      },

      stroke: {
        lineCap: 'round'
      },

      labels: [
        config.label
      ]
    };
  });

  /**
   * Texto que se mostrará en el centro del gauge.
   */
  getFormattedValue(): string {
    const config = this.config();
    const decimals = config.decimals ?? 1;
    const unit = config.unit ?? '';

    const value = config.displayValue === 'percentage'
      ? this.percentage()
      : this.normalizedValue();

    const formattedValue = value.toLocaleString('es-NI', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });

    return unit
      ? `${formattedValue} ${unit}`
      : formattedValue;
  }

  private toNumber(
    value: unknown,
    fallback: number
  ): number {
    const numberValue = Number(value);

    return Number.isFinite(numberValue)
      ? numberValue
      : fallback;
  }


}
