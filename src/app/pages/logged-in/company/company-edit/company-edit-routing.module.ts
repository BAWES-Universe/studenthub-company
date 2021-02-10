import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyEditPage } from './company-edit.page';

const routes: Routes = [
  {
    path: '',
    component: CompanyEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyEditPageRoutingModule {}
