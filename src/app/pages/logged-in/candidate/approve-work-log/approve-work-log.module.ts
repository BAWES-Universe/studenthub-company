import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApproveWorkLogPageRoutingModule } from './approve-work-log-routing.module';

import { ApproveWorkLogPage } from './approve-work-log.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ApproveWorkLogPageRoutingModule
  ],
  declarations: [ApproveWorkLogPage]
})
export class ApproveWorkLogPageModule {}
