export type GaugeChartType =
  | 'circle'
  | 'semi-circle';

export interface GaugeChartConfig {
  /**
   * Valor actual que mostrará el gauge.
   */
  value: number;

  /**
   * Valor mínimo permitido.
   */
  min?: number;

  /**
   * Valor máximo permitido.
   */
  max?: number;

  /**
   * Título principal del indicador.
   */
  label: string;

  /**
   * Unidad mostrada junto al valor.
   * Ejemplos: %, gal, km/gal, °C.
   */
  unit?: string;

  /**
   * Cantidad de decimales.
   */
  decimals?: number;

  /**
   * Tipo visual.
   */
  type?: GaugeChartType;

  /**
   * Altura del gráfico.
   */
  height?: number;

  /**
   * Color principal.
   */
  color?: string;

  /**
   * Color de fondo de la pista.
   */
  trackColor?: string;

  /**
   * Muestra el valor real o el porcentaje calculado.
   */
  displayValue?: 'real' | 'percentage';

  /**
   * Texto secundario opcional.
   */
  subtitle?: string;

  /**
   * Permite activar o desactivar animaciones.
   */
  animations?: boolean;
}