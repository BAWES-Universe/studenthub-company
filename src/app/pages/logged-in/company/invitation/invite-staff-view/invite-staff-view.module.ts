import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InviteStaffViewPage } from './invite-staff-view.page';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from "@ngx-translate/core";

// import { SharedModule } from "../../../../../shared.module";

const routes: Routes = [
  {
    path: '',
    component: InviteStaffViewPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild()
  ],
  declarations: [InviteStaffViewPage]
})
export class InviteStaffViewPageModule {}
