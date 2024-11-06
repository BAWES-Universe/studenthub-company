import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ContractComponent } from './contract.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ContractComponent
  ],
  imports: [
    IonicModule,
    RouterModule,
    TranslateModule.forChild(),
    CommonModule
  ],
  exports: [
    ContractComponent
  ]
})
export class ContractModule { }
