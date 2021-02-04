import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
// component
import { CompanyHeaderComponent } from './company-header';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
      CompanyHeaderComponent
  ],
  imports: [
      IonicModule,
      CommonModule,
  ],
  exports: [
      CompanyHeaderComponent,
  ]
})
export class CompanyHeaderModule { }
