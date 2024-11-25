import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransferFormMonthlyPage } from './transfer-form-monthly.page';

const routes: Routes = [
  {
    path: '',
    component: TransferFormMonthlyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransferFormMonthlyPageRoutingModule {}
