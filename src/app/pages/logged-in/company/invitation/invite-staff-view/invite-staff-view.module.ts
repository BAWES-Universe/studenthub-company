import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InviteStaffViewPage } from './invite-staff-view.page';

import { SharedModule } from "../../../../../shared.module";

const routes: Routes = [
  {
    path: '',
    component: InviteStaffViewPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [InviteStaffViewPage]
})
export class InviteStaffViewPageModule {}
