import { Routes } from '@angular/router';

import {Login} from './pages/login/login';
import { MainLayout } from './main-layout/main-layout';
import { Dashboard } from './pages/dashboard/dashboard';


export const routes: Routes = [
{
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
},
{
        path: 'login',
        component: Login
},
{
    path: 'main',
    component:MainLayout,
    children:[
        {
            path:'dashboard',
            component:Dashboard
        },
        {
            path:'',
            redirectTo:'dashboard',
            pathMatch:'full'
        },
        {
            path:'catalogueviewer/:name',
            loadComponent: () => import('./pages/catalogueviewer/catalogueviewer')
            .then(m => m.Catalogueviewer)
        },
        {
            path:'fleetviewer/:name',
            loadComponent: () => import('./pages/fleetviewer/fleetviewer')
            .then(m => m.Fleetviewer)
        },
        {
            path:'reportviewer/:name',
            loadComponent: () => import('./pages/reports-viewer/reports-viewer')
            .then(m => m.ReportsViewer)
        }
    ]
}


];
