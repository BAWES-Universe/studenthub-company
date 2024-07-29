import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyViewPageRoutingModule } from './company-view-routing.module';

import { CompanyViewPage } from './company-view.page';
import {LoadingModalModule} from "../../../../components/loading-modal/loading-modal.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CompanyViewPageRoutingModule,
        LoadingModalModule,
        TranslateModule.forChild()
    ],
  declarations: [CompanyViewPage]
})
export class CompanyViewPageModule {}
