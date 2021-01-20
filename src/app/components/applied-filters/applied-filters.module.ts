import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { NgAisModule } from 'angular-instantsearch';
import { AppliedFiltersComponent } from './applied-filters.component';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { PipesModule } from 'src/app/pipes/pipes.module';

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
        PipesModule,
        NgAisModule,
    ],
    exports: [
        AppliedFiltersComponent
    ]
})
export class AppliedFiltersModule { }