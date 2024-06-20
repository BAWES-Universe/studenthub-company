import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoreListPageRoutingModule } from './store-list-routing.module';

import { StoreListPage } from './store-list.page';
import {LoadingModalModule} from 'src/app/components/loading-modal/loading-modal.module';
import {NoItemsModule} from 'src/app/components/no-items/no-items.module';
import {TranslateModule} from '@ngx-translate/core';
import { CandidateOptionComponent } from './candidate-option-component';
import { SelectSearchModule } from 'src/app/components/select-search/select-search.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoreListPageRoutingModule,
    LoadingModalModule,
    NoItemsModule,
    TranslateModule.forChild(),
    SelectSearchModule,
  ],
  declarations: [StoreListPage, CandidateOptionComponent]
})
export class StoreListPageModule {}
