import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractModalComponent } from './contract-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { LoadingModalModule } from '../loading-modal/loading-modal.module';



@NgModule({
  declarations: [
    ContractModalComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    LoadingModalModule,
    TranslateModule.forChild(),
  ],
  exports: [
    ContractModalComponent
  ]
})
export class ContractModalModule { }
