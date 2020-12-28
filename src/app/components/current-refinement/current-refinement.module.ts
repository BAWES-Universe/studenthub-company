import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { NgAisModule } from 'angular-instantsearch';
import { CurrentRefinementComponent } from './current-refinement.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [       
        CurrentRefinementComponent
    ],
    imports: [
        IonicModule,
        CommonModule,
        NgAisModule,
    ],
    exports: [
        CurrentRefinementComponent
    ]
})
export class CurrentRefinementModule { }