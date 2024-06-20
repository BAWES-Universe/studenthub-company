import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransferListPageRoutingModule } from './transfer-list-routing.module';

import { TransferListPage } from './transfer-list.page';
import {LoadingModalModule} from "../../../../components/loading-modal/loading-modal.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TransferListPageRoutingModule,
        LoadingModalModule,
        TranslateModule.forChild()
    ],
  declarations: [TransferListPage]
})
export class TransferListPageModule {}
