import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContractViewPage } from './contract-view.page';

const routes: Routes = [
  {
    path: ':id',
    component: ContractViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContractViewPageRoutingModule {}
