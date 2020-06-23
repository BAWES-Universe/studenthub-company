import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyViewPageRoutingModule } from './company-view-routing.module';

import { CompanyViewPage } from './company-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompanyViewPageRoutingModule
  ],
  declarations: [CompanyViewPage]
})
export class CompanyViewPageModule {}
