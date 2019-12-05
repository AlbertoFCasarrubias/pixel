import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthGuard} from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'list',
    loadChildren: () => import('./pages/list/list.module').then(m => m.ListPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'order',
    loadChildren: () => import('./pages/order/order.module').then( m => m.OrderPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'material',
    loadChildren: () => import('./pages/materials/material/material.module').then( m => m.MaterialPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'material/:id',
    loadChildren: () => import('./pages/materials/material/material.module').then( m => m.MaterialPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'materials',
    loadChildren: () => import('./pages/materials/materials.module').then( m => m.MaterialsPageModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
