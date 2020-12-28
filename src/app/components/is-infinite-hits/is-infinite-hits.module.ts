import { NgModule } from '@angular/core';
import { NgAisModule } from 'angular-instantsearch';

import { IsInfiniteHitsComponent } from './is-infinite-hits.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [       
        IsInfiniteHitsComponent
    ],
    imports: [
        IonicModule,
        CommonModule,
        NgAisModule
    ],
    exports: [
        IsInfiniteHitsComponent
    ]
})
export class IsInfiniteHitsModule { }