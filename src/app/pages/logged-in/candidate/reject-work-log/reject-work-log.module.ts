import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RejectWorkLogPageRoutingModule } from './reject-work-log-routing.module';

import { RejectWorkLogPage } from './reject-work-log.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RejectWorkLogPageRoutingModule
  ],
  declarations: [RejectWorkLogPage]
})
export class RejectWorkLogPageModule {}
