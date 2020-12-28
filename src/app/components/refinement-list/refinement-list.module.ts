import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { RefinementListComponent } from './refinement-list.component';
import { NgAisModule, NgAisRefinementListModule } from 'angular-instantsearch';
import { CurrentRefinementModule } from '../current-refinement/current-refinement.module';
import { InstantSearchModule } from '../instant-search/instant-search.module';
import { IsFacetsSearchModule } from '../is-facets-search/is-facets-search.module';
import { CommonModule } from '@angular/common';


@NgModule({
    declarations: [        
        RefinementListComponent
    ],
    imports: [
        CurrentRefinementModule,
        IonicModule,
        NgAisModule,
        InstantSearchModule,
        IsFacetsSearchModule,
        CommonModule,
    //     ais-facets-search,
    //    NgAisFacetsSearch,     
    //    NgAisRefinementListModule
    ],
    exports: [
        InstantSearchModule,
        RefinementListComponent
    ]
})
export class RefinementListModule { }