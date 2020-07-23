import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransferFormPageRoutingModule } from './transfer-form-routing.module';

import { TransferFormPage } from './transfer-form.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
 
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    TransferFormPageRoutingModule,
    PipesModule
  ],
  exports: [
    PipesModule
  ],
  declarations: [TransferFormPage]
})
export class TransferFormPageModule {}
