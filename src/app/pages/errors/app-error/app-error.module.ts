import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AppErrorPageRoutingModule } from './app-error-routing.module';

import { AppErrorPage } from './app-error.page';
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        AppErrorPageRoutingModule,
        TranslateModule.forChild()
    ],
  declarations: [AppErrorPage]
})
export class AppErrorPageModule {}
