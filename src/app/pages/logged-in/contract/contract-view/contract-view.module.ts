import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContractViewPageRoutingModule } from './contract-view-routing.module';

import { ContractViewPage } from './contract-view.page';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    LoadingModalModule,
    ContractViewPageRoutingModule
  ],
  declarations: [ContractViewPage]
})
export class ContractViewPageModule {}
