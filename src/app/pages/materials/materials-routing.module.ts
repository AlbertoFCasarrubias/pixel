import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaterialsPage } from './materials.page';

const routes: Routes = [
  {
    path: '',
    component: MaterialsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaterialsPageRoutingModule {}
