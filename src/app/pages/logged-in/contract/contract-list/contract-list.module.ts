import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContractListPageRoutingModule } from './contract-list-routing.module';

import { ContractListPage } from './contract-list.page';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { CandidateModule } from 'src/app/components/candidate/candidate.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CandidateModule,
    ContractListPageRoutingModule,
    LoadingModalModule,
    TranslateModule.forChild()
  ],
  declarations: [ContractListPage]
})
export class ContractListPageModule {}
