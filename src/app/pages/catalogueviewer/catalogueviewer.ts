import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, signal, computed, effect } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { map, filter, distinctUntilChanged } from 'rxjs/operators';

import { Methods } from '../../services/methods';
import { Tools } from '../../services/tools';
import { ParametersCatalogue, Roles } from '../../models/generals-interfaces';

import {CatalogueFormModal} from '../../shared/catalogue-form-modal/catalogue-form-modal'
import {
  CatalogueFormConfig,
  CatalogueFormMode
} from '../../models/crud';

import {getCatalogueFormConfig} from '../../configs/catalogue-form-field.config';
import { MiselanousData } from '../../services/miselanous-data';
import { CRUDServices } from '../../services/crud.services';


type CatalogueName = 'pumps' | 'tanks' | 'product' | 'type_vehicles' | 'group';





@Component({
  selector: 'app-catalogueviewer',
  imports: [
    CommonModule,
    CatalogueFormModal
  ],
  templateUrl: './catalogueviewer.html',
  styleUrl: './catalogueviewer.scss',
})
export class Catalogueviewer implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private services: Methods,
    public tools: Tools,
    public router: Router,
    public miselanous:MiselanousData,
    public CRUD:CRUDServices
  ) {

effect( () =>{

  this.route.paramMap
      .pipe(
        map(params => params.get('name') as CatalogueName),
        filter((name): name is CatalogueName => !!name && !!this.catalogueConfig[name]),
        distinctUntilChanged()  
      )
      .subscribe((nameCatalogue: CatalogueName) => {

        this.catalogueName.set(nameCatalogue);
        this.catalogueData.set([]);
        this.catalogueColumns.set([]);
        this.catalogueCaptions.set([]);
        this.catalogueTitle.set(this.catalogueConfig[nameCatalogue].title);
        this.currentPage.set(1);
   
            this.catalogueName.set(nameCatalogue);
        this.verifyPermissions(this.services.CataloguePermices());
        this.getDataCatalogues(nameCatalogue);
        this.miselanous.loadDataMiselaous();

      });

})

  }

  catalogueData = signal<any[]>([]);
  catalogueColumns = signal<string[]>([]);
  catalogueTitle = signal<string>('Catálogo');
  catalogueCaptions = signal<string[]>([]);

  currentPage = signal<number>(1);
  pageSize = signal<number>(10);

  pageSizeOptions: number[] = [5, 10, 25, 50];

  catalogueConfig: Record<CatalogueName, { title: string; columns: string[];captions:string[] }> = {
    pumps: {
      title: 'Surtidores',
      columns: [
        'Name',
        'IdPump',
        'productName',
        'Type_register',
        'comunicationType',
        'company'
      ],
      captions:[
        'Nombre',
        'Id de Bomba',
        'Producto',
        'Tipo de registro',
        'Comunicacion',
        'Empresa'
      ]
    },

    tanks: {
      title: 'Tanques de combustible',
      columns: [
        'Name',
        'TankId',
        'capacity',
        'saldofinal',
        'ullage',
        'percent',
        'sensorActive',
        'active'
      ],
      captions:[
        'Nombre',
        'Id de Tanque',
        'capacidad',
        'Saldo',
        'Cant. a rellenar',
        '%',
        'Sensor',
        'Estado'
      ]
    },

    product: {
      title: 'Productos',
      columns: [
        'Name',
        'description',
        'numberActive',
        'company',
        'active'
      ],
      captions:[
        'Nombre',
        'Descripcion',
        'Numero de activo',
        'Empresa',
        'Estado'
      ]
    },

    type_vehicles: {
      title: 'Tipo de vehículos',
      columns: [
        'Name',
        'icon',
        'company',
        'active'
      ],
      captions:[
        'Nombre',
        'Icono',
        'Empresa',
        'Estado'
      ]
    },
    group:{
      title:'Grupo de ehiculos',
      columns:[
        'Name',
        'active',
        'company'
      ],
      captions:[
        'Nombre del grupo',
        'Estado',
        'Empresa'
      ]
    }
  };


formModalVisible = signal(false);

formMode = signal<CatalogueFormMode>('create');

formConfig = signal<CatalogueFormConfig | null>(null);

selectedRecord = signal<Record<string, unknown> | null>(null);

catalogueName = signal<CatalogueName>('pumps');



  // permisos de roles
  create = signal<boolean>(false);
  update = signal<boolean>(false);
  delete = signal<boolean>(false);



  ngOnInit(): void {
    
  }

  // ==========================
  // COMPUTED DEL PAGER
  // ==========================

  totalItems = computed(() => {
    return this.catalogueData().length;
  });

  totalPages = computed(() => {
    return Math.ceil(this.totalItems() / this.pageSize());
  });

  paginatedData = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();

    return this.catalogueData().slice(start, end);
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
  // CARGAR CATÁLOGO
  // ==========================

  async getDataCatalogues(nameCatalog: CatalogueName) {
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

      this.catalogueData.set(data);

      this.catalogueTitle.set(
        this.catalogueConfig[nameCatalog]?.title ?? 'Catálogo'
      );

      this.catalogueColumns.set(
        this.catalogueConfig[nameCatalog]?.columns ?? Object.keys(data[0] ?? {})
      );

    this.catalogueCaptions.set(
      this.catalogueConfig[nameCatalog]?.captions ?? {}
    );

      this.currentPage.set(1);

      console.log('Catálogo:', nameCatalog);
      console.log('Columnas:', this.catalogueColumns());
      console.log('Datos:', this.catalogueData());
      console.log('captions:',this.catalogueCaptions());

    } catch (error) {
      console.error(error);

      this.catalogueData.set([]);
      this.catalogueColumns.set([]);

      this.tools.toast('Error en el catálogo', 'error', 'center');

    } finally {
      this.tools.close();
    }
  };


  verifyPermissions(roles:Roles[] = []): void {
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
};


  createRecord(): void {

  console.log('Nuevo registro');

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

}

editRecord(row: Record<string, any>): void {

  console.log('Editar registro:', row);
  const config = getCatalogueFormConfig(
this.catalogueName()
  );

  if(!config){

    this.tools.info('Catalogo',`no existe en la configuracion este catalogo: ${this.catalogueName()}`);
  return;
  };


  this.formMode.set('update');
  this.formConfig.set(config);
  this.selectedRecord.set({...row});
  this.formModalVisible.set(true);

}

async deleteRecord(row: Record<string, any>):Promise<void> {
  console.log('Eliminar registro:', row);

  try {
    const stringInput = this.catalogueName() + 'delete';

    if(this.CRUD.CRUDmethods[stringInput]){

      const response = await this.tools.question('Eliminar',`Esta seguro de eliminar el registro ${row['Name']} ?`);

      if(response.isConfirmed){
       
              this.CRUD.CRUDmethods[stringInput](row);
              this.tools.toast('Item eliminado','success','center')
      }

    }
    
 //   this.tools.info('Catalogo','este metodo aun no existe')
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

     if(this.CRUD.CRUDmethods[stringInput]){
      
       await this.CRUD.CRUDmethods[stringInput](data);
        await this.getDataCatalogues(this.catalogueName());
      this.tools.info('Creacion','El usuario creo un nuevo item');
      this.tools.playSound('/sounds/ost_1.mp3');
     }



this.closeFormModal();
    return;
  }

  if(this.formMode() === 'update'){


        const stringInput:any = this.catalogueName() + 'update';

     if(this.CRUD.CRUDmethods[stringInput]){
      
     await this.CRUD.CRUDmethods[stringInput](data);
     await this.getDataCatalogues(this.catalogueName()); 
     this.tools.info('Actualizacion',`el registro ${data['Name']} fue modificado...`);
      this.tools.playSound('/sounds/ost_1.mp3');
     }else {

      this.tools.toast('el metodo no existe','error','center');

     }



this.closeFormModal();
    return;

  }

};

}