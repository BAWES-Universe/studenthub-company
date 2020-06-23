import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidateListPageRoutingModule } from './candidate-list-routing.module';

import { CandidateListPage } from './candidate-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CandidateListPageRoutingModule
  ],
  declarations: [CandidateListPage]
})
export class CandidateListPageModule {}
