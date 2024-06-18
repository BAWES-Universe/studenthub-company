import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApproveWorkLogPage } from './approve-work-log.page';

const routes: Routes = [
  {
    path: '',
    component: ApproveWorkLogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApproveWorkLogPageRoutingModule {}
