import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransferViewPageRoutingModule } from './transfer-view-routing.module';

import { TransferViewPage } from './transfer-view.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import {LoadingModalModule} from "../../../../components/loading-modal/loading-modal.module";
import {TranslateModule} from "@ngx-translate/core";
import { ContractModule } from 'src/app/components/contract/contract.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TransferViewPageRoutingModule,
        PipesModule,
        LoadingModalModule,
        ContractModule,
        TranslateModule.forChild()
    ],
    exports: [
        PipesModule
    ],
    declarations: [TransferViewPage]
})
export class TransferViewPageModule {}
