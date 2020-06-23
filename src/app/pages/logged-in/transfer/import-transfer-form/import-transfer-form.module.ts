import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImportTransferFormPageRoutingModule } from './import-transfer-form-routing.module';

import { ImportTransferFormPage } from './import-transfer-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ImportTransferFormPageRoutingModule
  ],
  declarations: [ImportTransferFormPage]
})
export class ImportTransferFormPageModule {}
