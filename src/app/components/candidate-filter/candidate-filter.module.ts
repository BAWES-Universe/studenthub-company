import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RefinementListModule } from '../refinement-list/refinement-list.module';
import { CandidateFilterComponent } from './candidate-filter';
import { NgAisModule } from 'angular-instantsearch';
import { CommonModule } from "@angular/common";
import { RangeRefinementModule } from '../range-refinement-list/range-refinement-list.module';
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
  declarations: [
    CandidateFilterComponent
  ],
    imports: [
        CommonModule,
        IonicModule,
        NgAisModule,
        RefinementListModule,
        RangeRefinementModule,
        TranslateModule
    ],
  exports: [
    CandidateFilterComponent
  ]
})
export class CandidateFilterModule { }
