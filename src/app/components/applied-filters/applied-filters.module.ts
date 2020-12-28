import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { NgAisModule } from 'angular-instantsearch';
import { AppliedFiltersComponent } from './applied-filters.component';
import { CommonModule, CurrencyPipe } from '@angular/common';

@NgModule({
    declarations: [       
        AppliedFiltersComponent
    ],
    providers: [
        CurrencyPipe      
    ],
    imports: [
        CommonModule,
        IonicModule,
        NgAisModule,
    ],
    exports: [
        AppliedFiltersComponent
    ]
})
export class AppliedFiltersModule { }