import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ViewPage } from './view.page';
import { ViewPageRoutingModule } from './view.routing.module';
import {CompanyHeaderModule} from 'src/app/components/company-header/company-header.module';

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
    CompanyHeaderModule,
    ViewPageRoutingModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ViewPage]
})
export class ViewPageModule {}
