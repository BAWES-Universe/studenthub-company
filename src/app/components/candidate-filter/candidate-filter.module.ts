import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { CandidateFilterComponent } from './candidate-filter';
import { NgAisModule } from 'angular-instantsearch';
import { RefinementListModule } from '../refinement-list/refinement-list.module';
import { CommonModule } from "@angular/common";


@NgModule({
  declarations: [
    CandidateFilterComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    NgAisModule,
    RefinementListModule
  ],
  exports: [
    CandidateFilterComponent
  ]
})
export class CandidateFilterModule { }
