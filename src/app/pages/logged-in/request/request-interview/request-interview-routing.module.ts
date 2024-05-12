import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestInterviewPage } from './request-interview.page';

const routes: Routes = [
  {
    path: '',
    component: RequestInterviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestInterviewPageRoutingModule {}
