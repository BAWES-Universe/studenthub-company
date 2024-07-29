import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogHourListPage } from './log-hour-list.page';

const routes: Routes = [
  {
    path: ':candidate_id/:date/:store_id',
    component: LogHourListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogHourListPageRoutingModule {}
