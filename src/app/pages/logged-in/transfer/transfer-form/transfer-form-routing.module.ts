import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransferFormPage } from './transfer-form.page';

const routes: Routes = [
  {
    path: '',
    component: TransferFormPage
  },{
    path: ':id',
    component: TransferFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransferFormPageRoutingModule {}
