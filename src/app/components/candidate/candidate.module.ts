import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateComponent } from './candidate.component';
import { IonicModule } from '@ionic/angular';
import {TranslateModule} from "@ngx-translate/core";



@NgModule({
  declarations: [
    CandidateComponent
  ],
    imports: [
        CommonModule,
        IonicModule,
        TranslateModule
    ],
  exports: [
    CandidateComponent
  ]
})
export class CandidateModule { }
