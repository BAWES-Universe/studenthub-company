import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransferViewPageRoutingModule } from './transfer-view-routing.module';

import { TransferViewPage } from './transfer-view.page';
import {GroupByPipe} from "../../../../pipes/groupby-pipe";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TransferViewPageRoutingModule
    ],
    exports: [
        GroupByPipe
    ],
    declarations: [TransferViewPage, GroupByPipe]
})
export class TransferViewPageModule {}
