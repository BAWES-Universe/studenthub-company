import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InvitationFormPage } from './invitation-form.page';
import {TranslateModule} from "@ngx-translate/core";

// import { SharedModule } from '../../../../../shared.module';


const routes: Routes = [
  {
    path: ':role',
    component: InvitationFormPage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        // SharedModule,
        RouterModule.forChild(routes),
        TranslateModule
    ],
  declarations: [InvitationFormPage]
})
export class InvitationFormPageModule {}
