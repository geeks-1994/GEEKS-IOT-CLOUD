import { Component,signal,OnInit,Inject,PLATFORM_ID } from '@angular/core';
import { RouterLink,RouterLinkActive, RouterOutlet,Router } from '@angular/router';
import { CommonModule,isPlatformBrowser} from '@angular/common';
import { Methods } from '../services/methods';
import { Tools } from '../services/tools';
import { mainMenu, SessionData } from '../models/generals-interfaces';
import { use } from 'apexcharts';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    CommonModule
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout  implements OnInit{

 sidebarCollapsed:boolean = false;
 openedMenu:string | null = null;
 email = signal('');

  sidebarOpen = signal(true);

  public mainMenu:any = [
    {
      name:'Dasboard',
      icon:"bi bi-house",
      route:"/main/dashboard"
    },
    {
      name:'Catalogos',
      icon:"bi bi-card-list",
      submenu:[]
    },
    {
      name:'Flotilla',
      icon:"bi bi-truck",
      submenu:[]
    },
    {
      name:'Reportes',
      icon:'bi bi-file-earmark-text',
      submenu:[
        {
          name:"raw_data",
          description:"Datos crudos",
          route:[
            '/main/reportviewer',
            'raw_data'
          ]
        },
        {
          name:"summary_data",
          description:"Resumen por tipo de vehiculo",
          route:[
            '/main/reportviewer',
            'summary_data'
          ]
        },
        {
          name:"Level_data",
          description:"Comportamiento de Tanque",
          route:[
           '/main/reportviewer',
           'Fuel_Measure'
          ]
        },
        {
         name:'Balance',
         description:'Balance de saldo por Tanque',
         route:[
          '/main/reportviewer',
          'Balance'
         ]
        }
      ]
    }
  ]


  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  };

toggleMenu(menuName: string): void {
  if (this.sidebarCollapsed) {
    return;
  }

  this.openedMenu = this.openedMenu === menuName ? null : menuName;
}

isMenuOpen(menuName: string): boolean {
  return this.openedMenu === menuName;
}


  constructor( private services:Methods,private tools:Tools,
    public router:Router,
    @Inject(PLATFORM_ID) private platformId: Object){}

  ngOnInit():void {
  

   if (isPlatformBrowser(this.platformId)) {
      this.checkSession();
    }

      if (this.sidebarCollapsed) {
       this.openedMenu = null;
  }

  };


checkSession(): void {
  this.services.SessionLoaded.set(false);

  this.services.validateSession().subscribe({
    next: (user) => {
      this.email.set(user.user.email);

      this.mainMenu[1].submenu = user.user.Catalogues ?? [];
      this.mainMenu[2].submenu = user.user.fleet ?? [];

      const dataSession: SessionData = {
        userSalesforce: user.user.userSalesForce,
        passwordSalesForce: user.user.passwordSalesForce,
        company: user.user.company,
        Migration: user.user.Migrating || false,
      };

      this.services.setSession(dataSession);
       this.services.CataloguePermices.set(user.user.RolesCatalogues ?? []);
       this.services.FleetPermices.set(user.user.RolesFleet ?? []);

      console.log('Sesión cargada:', this.services.SessionData());
    },

    error: (err) => {
      console.error('Sesión inválida:', err);

      this.services.clearSession();

      localStorage.removeItem('gsuiteToken');

      this.tools.error(
        'Error de sesión',
        'Puede que la sesión haya terminado'
      );

      this.router.navigate(['/']);
    }
  });
};


trackByMenuName(index: number, menu: any): string {
  return menu.name;
};

trackBySubMenuDescription(index: number, item: any): string {
  return item.description;
};



async logOut():Promise<void>{

  try {
  const response = await  this.tools.question('Log out','Desea salir de la session.');

  if(response.isConfirmed){
      this.services.clearSession();

      localStorage.removeItem('gsuiteToken');

      this.tools.info('Session','te esperamos nuevamente ...:)');
  this.tools.playSound('/sounds/delete_ost.mp3');
      this.router.navigate(['/']);

  }
  } catch (error) {
    
  }

}

}
