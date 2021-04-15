import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ViewPage } from './view.page';
import { ViewPageRoutingModule } from './view.routing.module';
import {CompanyHeaderModule} from 'src/app/components/company-header/company-header.module';
import { MenuModule } from 'src/app/components/menu/menu.module';
import {TranslateModule} from "@ngx-translate/core";

const routes: Routes = [
  {
    path: '',
    component: ViewPage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MenuModule,
        CompanyHeaderModule,
        ViewPageRoutingModule,
        RouterModule.forChild(routes),
        TranslateModule
    ],
  declarations: [ViewPage]
})
export class ViewPageModule {}
