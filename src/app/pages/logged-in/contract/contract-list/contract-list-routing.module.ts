import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContractListPage } from './contract-list.page';

const routes: Routes = [
  {
    path: '',
    component: ContractListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContractListPageRoutingModule {}
