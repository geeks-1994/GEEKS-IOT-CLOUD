import { Component, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { map, filter, distinctUntilChanged } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

import { Methods } from '../../services/methods';
import { Tools } from '../../services/tools';
import { ParametersCatalogue } from '../../models/generals-interfaces';

type CatalogueName = 'Vehicles' | 'driver' | 'Tags' | 'Fleets';

@Component({
  selector: 'app-fleetviewer',
  imports: [CommonModule],
  templateUrl: './fleetviewer.html',
  styleUrl: './fleetviewer.scss',
})
export class Fleetviewer implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private services: Methods,
    public tools: Tools,
    public router: Router
  ) {
   effect(()=>{

this.route.paramMap
      .pipe(
        map(params => params.get('name') as CatalogueName),
        filter((name): name is CatalogueName => !!name && !!this.catalogueConfig[name]),
        distinctUntilChanged()
      )
      .subscribe((nameCatalogue: CatalogueName) => {
        this.catalogueData.set([]);
        this.catalogueColumns.set([]);
        this.catalogueCaptions.set([]);
        this.searchText.set('');
        this.currentPage.set(1);

        this.catalogueTitle.set(this.catalogueConfig[nameCatalogue].title);

        this.getDataCatalogues(nameCatalogue);
      });

   })


  }

  // ==========================
  // SIGNALS PRINCIPALES
  // ==========================

  catalogueData = signal<any[]>([]);
  catalogueColumns = signal<string[]>([]);
  catalogueCaptions = signal<string[]>([]);
  catalogueTitle = signal<string>('Flota');

  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  searchText = signal<string>('');

  pageSizeOptions: number[] = [25, 50,100,200];

  // ==========================
  // CONFIGURACIÓN DE VISTAS
  // ==========================

  catalogueConfig: Record<CatalogueName, { title: string; columns: string[]; captions: string[] }> = {
    Vehicles: {
      title: 'Vehículos',
      columns: [
        'Name',
        'VehicleName',
        'PlateNumber',
        'Active',
        'AssignedQuota',
        'QuotaStatus',
        'QuotaVolume',
        'Catalogue_Group_Vehicle',
        'Catalogue_Vehicle_Type'
      ],
      captions: [
        'Nombre',
        'Id Vehículo',
        'Placa',
        'Estado',
        'Cuota asignada',
        'Estado de Cuota',
        'Saldo',
        'Grupo',
        'Tipo de vehículo'
      ]
    },

    driver: {
      title: 'Conductores',
      columns: [
        'Name',
        'firstName',
        'lastName',
        'GroupName'
      ],
      captions: [
        'Codigo',
        'Nombre',
        'Apellido',
        'Grupo'
      ]
    },

    Tags: {
      title: 'Tags',
      columns: [
        'TagCode',
        'OdometerPrompt',
        'HourometerPrompt',
        'VehicleName',
        'Company',
        'Active'
      ],
      captions: [
        'Código RFID',
        'Kilometraje',
        'Horómetro',
        'Nombre del Vehículo',
        'Empresa',
        'Estado'
      ]
    },

    Fleets: {
      title: 'Flotas',
      columns: [
        'Name',
        'Active'
      ],
      captions: [
        'Nombre',
        'Estado'
      ]
    }
  };

  // ==========================
  // INIT
  // ==========================

  ngOnInit(): void {
    
  }

  // ==========================
  // BÚSQUEDA
  // ==========================

  changeSearch(value: string): void {
    this.searchText.set(value);
    this.currentPage.set(1);
  }

  filteredData = computed(() => {
    const text = this.searchText().toLowerCase().trim();

    if (!text) {
      return this.catalogueData();
    }

    return this.catalogueData().filter(row => {
      return this.catalogueColumns().some(column => {
        const value = row[column];

        if (value === null || value === undefined) {
          return false;
        }

        return String(value).toLowerCase().includes(text);
      });
    });
  });

  // ==========================
  // RESUMEN DE FLOTA
  // ==========================

  activeItems = computed(() => {
    return this.catalogueData().filter(row => {
      return row.Active === true || row.active === true;
    }).length;
  });

  inactiveItems = computed(() => {
    return this.catalogueData().filter(row => {
      return row.Active === false || row.active === false;
    }).length;
  });

  // ==========================
  // COMPUTED DEL PAGER
  // ==========================

  totalItems = computed(() => {
    return this.filteredData().length;
  });

  totalPages = computed(() => {
    const pages = Math.ceil(this.totalItems() / this.pageSize());
    return pages <= 0 ? 1 : pages;
  });

  paginatedData = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();

    return this.filteredData().slice(start, end);
  });

  pages = computed(() => {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  });

  startItem = computed(() => {
    if (this.totalItems() === 0) return 0;

    return ((this.currentPage() - 1) * this.pageSize()) + 1;
  });

  endItem = computed(() => {
    const end = this.currentPage() * this.pageSize();

    return end > this.totalItems() ? this.totalItems() : end;
  });

  // ==========================
  // MÉTODOS DEL PAGER
  // ==========================

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;

    this.currentPage.set(page);
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(page => page + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1);
    }
  }

  changePageSize(size: number): void {
    this.pageSize.set(Number(size));
    this.currentPage.set(1);
  }

  // ==========================
  // CARGAR CATÁLOGO / FLOTA
  // ==========================

  async getDataCatalogues(nameCatalog: CatalogueName): Promise<void> {
    try {
      const parameters: ParametersCatalogue = {
        nameObject: nameCatalog,
        user: this.services.SessionData().userSalesforce,
        password: this.services.SessionData().passwordSalesForce,
        company: this.services.SessionData().company
      };

      this.tools.loading();

      const response: any[] = await firstValueFrom(
        this.services.GetPostDataCatalogue<any>(parameters)
      );

      const data = response ?? [];
      const config = this.catalogueConfig[nameCatalog];

      this.catalogueData.set(data);

      this.catalogueTitle.set(
        config?.title ?? 'Flota'
      );

      this.catalogueColumns.set(
        config?.columns ?? Object.keys(data[0] ?? {})
      );

      this.catalogueCaptions.set(
        config?.captions ?? Object.keys(data[0] ?? {})
      );

      this.searchText.set('');
      this.currentPage.set(1);

      console.log('Fleet catalogue:', nameCatalog);
      console.log('Columnas:', this.catalogueColumns());
      console.log('Datos:', this.catalogueData());
      console.log('Captions:', this.catalogueCaptions());

    } catch (error) {
      console.error(error);

      this.catalogueData.set([]);
      this.catalogueColumns.set([]);
      this.catalogueCaptions.set([]);
      this.searchText.set('');
      this.currentPage.set(1);

      this.tools.toast('Error al cargar la información de flota', 'error', 'center');

    } finally {
      this.tools.close();
    }
  }

}