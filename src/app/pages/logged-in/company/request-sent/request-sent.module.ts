import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RequestSentPage } from './request-sent.page';
import {TranslateModule} from "@ngx-translate/core";

const routes: Routes = [
  { path: '', component: RequestSentPage },
  { path: ':company_uuid', component: RequestSentPage },
  { path: ':company_uuid/:company_name', component: RequestSentPage }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        TranslateModule.forChild()
    ],
  declarations: [RequestSentPage]
})
export class RequestSentPageModule {}
