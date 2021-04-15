import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoreViewPageRoutingModule } from './store-view-routing.module';

import { StoreViewPage } from './store-view.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import { NoItemsModule } from 'src/app/components/no-items/no-items.module';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        NoItemsModule,
        LoadingModalModule,
        StoreViewPageRoutingModule,
        TranslateModule
    ],
  declarations: [StoreViewPage]
})
export class StoreViewPageModule {}
