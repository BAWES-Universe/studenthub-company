import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyRequestViewPage } from './company-request-view.page';

const routes: Routes = [
  {
    path: ':request_uuid',
    component: CompanyRequestViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyRequestViewRoutingModule {}
