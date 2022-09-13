import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InvitationPermissionPage } from './invitation-permission.page';
import { TranslateModule } from "@ngx-translate/core";

// import { SharedModule } from '../../../../../shared.module';


const routes: Routes = [
  {
    path: '',
    component: InvitationPermissionPage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        // SharedModule,
        IonicModule,
        RouterModule.forChild(routes),
        TranslateModule
    ],
  declarations: [InvitationPermissionPage]
})
export class InvitationPermissionPageModule {}
