import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidateListPageRoutingModule } from './candidate-list-routing.module';

import { CandidateListPage } from './candidate-list.page';
import {LoadingModalModule} from "../../../../components/loading-modal/loading-modal.module";
import {NoItemsModule} from "../../../../components/no-items/no-items.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CandidateListPageRoutingModule,
        LoadingModalModule,
        NoItemsModule
    ],
  declarations: [CandidateListPage]
})
export class CandidateListPageModule {}
