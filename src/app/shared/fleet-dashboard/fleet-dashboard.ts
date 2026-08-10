import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  OnInit,
  signal,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
  effect,
  input
} from '@angular/core';
import { FleetDataDashboard } from '../../models/report-interfaces';
import { DynamicChart } from '../../pages/dynamic-chart/dynamic-chart';

@Component({
  selector: 'app-fleet-dashboard',
  imports: [
    CommonModule,
    DynamicChart
  ],
  templateUrl: './fleet-dashboard.html',
  styleUrl: './fleet-dashboard.scss',
})
export class FleetDashboard implements OnInit,AfterViewInit, OnDestroy {

@ViewChild('tabulatorTable',{static:false})
tabulatorTable!:ElementRef<HTMLDivElement>;

  private table: any = null;
  private viewReady = false;
  private isBrowser = false;

  readonly expandedPanel = signal<string | null>(null);

 public config = input.required<FleetDataDashboard>();
 

  constructor( @Inject(PLATFORM_ID) private platformId: Object) {
    
    this.isBrowser = isPlatformBrowser(this.platformId);

    effect(() => {

        const cfg = this.config();

        if (!this.table) return;

        this.table.replaceData(cfg.data);

        this.table.setColumns(cfg.selectedTable);

    });
  }
 
 
 async ngOnInit() {


    console.log(this.config().selectedTable);
    console.log(this.config().data);
   await this.tryCreateOrUpdateTable();
   this.table?.setData(this.config().data);
   this.table?.redraw(true);

  };


    ngAfterViewInit(): void {
    this.viewReady = true;
    this.tryCreateOrUpdateTable();
  }

  ngOnDestroy(): void {
    if (this.table) {
      this.table.destroy();
      this.table = null;
    }
  };

    private async tryCreateOrUpdateTable(): Promise<void> {
    if (!this.isBrowser) return;
    if (!this.viewReady) return;
    if (!this.tabulatorTable?.nativeElement) return;

    const columns = this.config().selectedTable;

    if (!columns || columns.length === 0) {
      console.warn('Tabulator aún no se crea porque no hay columnas cargadas.');
      return;
    }

    if (!this.table) {
      await this.createTable();
      return;
    }

    this.table.setColumns(columns);
    this.table.setData(this.config().data);
    this.table.redraw(true);
  }


    private async createTable(): Promise<void> {
    if (!this.isBrowser) return;
    if (!this.tabulatorTable?.nativeElement) return;

    const { TabulatorFull } = await import('tabulator-tables');

    this.table = new TabulatorFull(this.tabulatorTable.nativeElement, {
      data: this.config().data,
      layout: 'fitColumns',

      height: '520px',

      pagination: true,
      paginationSize: 15,
      paginationSizeSelector: [10, 15, 25, 50, 100],

      movableColumns: true,
      resizableColumnFit: true,

      placeholder: 'No hay datos para mostrar',

      columns:this.config().selectedTable
    });
  };


    togglePanel(panelId: string): void {

    if (this.expandedPanel() === panelId) {
      this.expandedPanel.set(null);
      document.body.classList.remove('panel-expanded');
    } else {
      this.expandedPanel.set(panelId);
      document.body.classList.add('panel-expanded');
    }

  }

  isExpanded(panelId: string): boolean {
    return this.expandedPanel() === panelId;
  }


}
