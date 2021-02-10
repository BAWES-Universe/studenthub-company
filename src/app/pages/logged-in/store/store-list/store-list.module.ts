import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoreListPageRoutingModule } from './store-list-routing.module';

import { StoreListPage } from './store-list.page';
import {LoadingModalModule} from "../../../../components/loading-modal/loading-modal.module";
import {NoItemsModule} from "../../../../components/no-items/no-items.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        StoreListPageRoutingModule,
        LoadingModalModule,
        NoItemsModule
    ],
  declarations: [StoreListPage]
})
export class StoreListPageModule {}
