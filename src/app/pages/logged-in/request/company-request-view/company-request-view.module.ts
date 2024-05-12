import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyRequestViewRoutingModule } from './company-request-view-routing.module';

import { CompanyRequestViewPage } from './company-request-view.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { RecentActivityComponent } from 'src/app/components/recent-activity/recent-activity.component';
import { SuggestionModule } from 'src/app/components/suggestion/suggestion.module';
import {CandidateModule} from "../../../../components/candidate/candidate.module";
import {TranslateModule} from "@ngx-translate/core";
import { RequestListingModule } from 'src/app/components/request-listing/request-listing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PipesModule,
        IonicModule,
        RequestListingModule,
        SuggestionModule,
        LoadingModalModule,
        CompanyRequestViewRoutingModule,
        CandidateModule,
        TranslateModule
    ],
  declarations: [
    CompanyRequestViewPage,
    RecentActivityComponent
  ]
})
export class CompanyRequestViewPageModule { }
