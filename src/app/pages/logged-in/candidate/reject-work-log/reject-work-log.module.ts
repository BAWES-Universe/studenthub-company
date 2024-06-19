import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RejectWorkLogPageRoutingModule } from './reject-work-log-routing.module';

import { RejectWorkLogPage } from './reject-work-log.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    RejectWorkLogPageRoutingModule
  ],
  declarations: [RejectWorkLogPage]
})
export class RejectWorkLogPageModule {}
