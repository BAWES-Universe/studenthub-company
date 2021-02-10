import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyEditPageRoutingModule } from './company-edit-routing.module';

import { CompanyEditPage } from './company-edit.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    CompanyEditPageRoutingModule
  ],
  declarations: [CompanyEditPage]
})
export class CompanyEditPageModule {}
