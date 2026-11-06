import { Component, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { map, filter, distinctUntilChanged } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

import { Methods } from '../../services/methods';
import { Tools } from '../../services/tools';
import { ParametersCatalogue, Roles } from '../../models/generals-interfaces';
import { CatalogueFormModal } from '../../shared/catalogue-form-modal/catalogue-form-modal';

import {
  CatalogueFormConfig,
  CatalogueFormMode
} from '../../models/crud';

import {getCatalogueFormConfig} from '../../configs/catalogue-form-field.config';
import { MiselanousData } from '../../services/miselanous-data';
import { CRUDServices } from '../../services/crud.services';



type CatalogueName = 'Vehicles' | 'driver' | 'Tags' | 'Fleets';

@Component({
  selector: 'app-fleetviewer',
  imports: [
    CommonModule,
  CatalogueFormModal
  ],
  templateUrl: './fleetviewer.html',
  styleUrl: './fleetviewer.scss',
})
export class Fleetviewer implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private services: Methods,
    public tools: Tools,
    public router: Router,
    public CRUD: CRUDServices,
    public miselanous:MiselanousData
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
        this.verifyPermissions(this.services.FleetPermices())
        ///console.warn(this.catalogueTitle());
        this.catalogueName.set(nameCatalogue);

        this.getDataCatalogues(nameCatalogue);
          this.miselanous.loadDataMiselaous();
        

      
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
  namecatalogue = signal<CatalogueName>('Fleets');

  // permisos de roles
  create = signal<boolean>(false);
  update = signal<boolean>(false);
  delete = signal<boolean>(false);


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
        'GroupName',
        'Active'
      ],
      captions: [
        'Codigo',
        'Nombre',
        'Apellido',
        'Grupo',
        'Estado'
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



formModalVisible = signal(false);

formMode = signal<CatalogueFormMode>('create');

formConfig = signal<CatalogueFormConfig | null>(null);

selectedRecord = signal<Record<string, unknown> | null>(null);

catalogueName = signal<CatalogueName>('Fleets');

   readonly isVehicle = computed(
    () => this.catalogueName() == 'Vehicles'
   );
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
        company: this.services.SessionData().company,
        Migration: this.services.SessionData().Migration
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
  };


verifyPermissions(roles: Roles[] = []): void {
  try {
    const permissions = new Map(
      roles.map(role => [
        role.name?.toUpperCase(),
        role.active === true
      ])
    );

    this.create.set(
      permissions.get('CREATE') ?? false
    );

    this.update.set(
      permissions.get('UPDATE') ?? false
    );

    this.delete.set(
      permissions.get('DELETE') ?? false
    );

  } catch (error) {
    this.create.set(false);
    this.update.set(false);
    this.delete.set(false);

    this.tools.error(
      'Permisos',
      'Verifique los permisos configurados'
    );
  }
}


createRecord(): void {

  console.log('Nuevo registro');
 console.log(this.catalogueName());
  const config = getCatalogueFormConfig(
    this.catalogueName()
  );

  if(!config){

    this.tools.info('Catalogo',`no existe en la configuracion este catalogo: ${this.catalogueName()}`);
  return;
  };

  this.formMode.set('create');
  this.formConfig.set(config);
  this.selectedRecord.set(null);
  this.formModalVisible.set(true);

};


editRecord(row: Record<string, any>,specialmethod:string = ''): void {

  console.log('Editar registro:', row);
  //console.log(this.catalogueName());
  
  let CatalogueOption = specialmethod == '' ? this.catalogueName() : specialmethod;


  const config = getCatalogueFormConfig(
CatalogueOption
  );

  if(!config){

    this.tools.info('Catalogo',`no existe en la configuracion este catalogo: ${this.catalogueName()}`);
  return;
  };


  this.formMode.set('update');
  this.formConfig.set(config);
  this.selectedRecord.set({...row});
  this.formModalVisible.set(true);

};

async deleteRecord(row: Record<string, any>):Promise<void> {
  console.log('Eliminar registro:', row);

  try {
    const stringInput = this.catalogueName() + 'delete';

    if(this.CRUD.CRUDmethods[stringInput]){

      const response = await this.tools.question('Eliminar',`Esta seguro de eliminar el registro ${row['Name'] || row['TagCode']} ?`);

      if(response.isConfirmed){
       
            await this.CRUD.CRUDmethods[stringInput](row);
              this.tools.toast('Item eliminado','success','center')
              this.tools.playSound('/sounds/delete_ost.mp3');
               await this.getDataCatalogues(this.catalogueName());
      }

    }else {
       this.tools.info('Catalogo','este metodo aun no existe')

    }
    

  } catch (error) {
    this.tools.error('error','el catalogo no puede ser eliminado');
  }


};



closeFormModal(): void {
  this.formModalVisible.set(false);
  this.selectedRecord.set(null);
};


async saveCatalogueRecord(
  data: Record<string, unknown>
):Promise<void> {

     console.log(this.formMode());
  if (this.formMode() === 'create') {
      console.log('Datos para crear:', data);
   // console.log(this.catalogueName());
   
    const stringInput:any = this.catalogueName() + 'create';

    console.log(stringInput);
     if(this.CRUD.CRUDmethods[stringInput]){
      
   await   this.CRUD.CRUDmethods[stringInput](data);
      this.tools.info('Creacion','El usuario creo un nuevo item');
      this.tools.playSound('/sounds/ost_1.mp3');
await this.getDataCatalogues(this.catalogueName());
     }



this.closeFormModal();
    return;
  }

  if(this.formMode() === 'update'){


        const stringInput:any = this.catalogueName() + 'update';

     if(this.CRUD.CRUDmethods[stringInput]){
      
    await  this.CRUD.CRUDmethods[stringInput](data);
      this.tools.info('Actualizacion',`el registro ${data['Name'] || data['TagCode']} fue modificado...`);
  this.tools.playSound('/sounds/ost_1.mp3');
 await this.getDataCatalogues(this.catalogueName());
     }else {

      this.tools.toast('el metodo no existe','error','center');

     }



this.closeFormModal();
    return;

  }

};

}