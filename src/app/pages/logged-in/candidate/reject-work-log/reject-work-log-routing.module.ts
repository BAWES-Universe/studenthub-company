import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RejectWorkLogPage } from './reject-work-log.page';

const routes: Routes = [
  {
    path: '',
    component: RejectWorkLogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RejectWorkLogPageRoutingModule {}
