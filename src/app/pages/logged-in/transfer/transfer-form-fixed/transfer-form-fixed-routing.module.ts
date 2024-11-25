import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransferFormFixedPage } from './transfer-form-fixed.page';

const routes: Routes = [
  {
    path: '',
    component: TransferFormFixedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransferFormFixedPageRoutingModule {}
