import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransferFormPageRoutingModule } from './transfer-form-routing.module';

import { TransferFormPage } from './transfer-form.page';
import {GroupByPipe} from "src/app/pipes/groupby-pipe";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    TransferFormPageRoutingModule
  ],
  exports: [
    GroupByPipe
  ],
  declarations: [TransferFormPage, GroupByPipe]
})
export class TransferFormPageModule {}
