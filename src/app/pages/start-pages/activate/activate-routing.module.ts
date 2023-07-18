import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivatePage } from './activate.page';

const routes: Routes = [
  {
    path: ':contact_email/:contact_auth_key/:company_id',
    component: ActivatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivatePageRoutingModule {}
