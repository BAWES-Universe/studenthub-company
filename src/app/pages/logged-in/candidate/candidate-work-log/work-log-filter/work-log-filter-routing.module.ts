import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkLogFilterPage } from './work-log-filter.page';

const routes: Routes = [
  {
    path: '',
    component: WorkLogFilterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkLogFilterPageRoutingModule {}
