import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { RefinementListComponent } from './refinement-list.component';
import { NgAisModule, NgAisRefinementListModule } from 'angular-instantsearch';
import { CurrentRefinementModule } from '../current-refinement/current-refinement.module';

import { IsFacetsSearchModule } from '../is-facets-search/is-facets-search.module';
import { CommonModule } from '@angular/common';
import { NgAisFacetsSearch } from 'angular-instantsearch/refinement-list/facets-search';


@NgModule({
    declarations: [        
        RefinementListComponent
    ],
    imports: [
        CurrentRefinementModule,
        IonicModule,
        NgAisModule,
        IsFacetsSearchModule,
        CommonModule,
    //     ais-facets-search,
    //    NgAisFacetsSearch,     
    //    NgAisRefinementListModule
    ],
    exports: [
        RefinementListComponent
    ]
})
export class RefinementListModule { }