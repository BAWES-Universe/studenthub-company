import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkLogListPage } from './work-log-list.page';

const routes: Routes = [
  {
    path: '',
    component: WorkLogListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkLogListPageRoutingModule {}
