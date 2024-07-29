import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidateViewPageRoutingModule } from './candidate-view-routing.module';

import { CandidateViewPage } from './candidate-view.page';
import {LoadingModalModule} from '../../../../components/loading-modal/loading-modal.module';
import {PipesModule} from '../../../../pipes/pipes.module';
import {TranslateModule} from "@ngx-translate/core";
import { RequestListingModule } from 'src/app/components/request-listing/request-listing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PipesModule,
        RequestListingModule,
        CandidateViewPageRoutingModule,
        LoadingModalModule,
        TranslateModule.forChild()
    ],
  declarations: [CandidateViewPage]
})
export class CandidateViewPageModule {}
