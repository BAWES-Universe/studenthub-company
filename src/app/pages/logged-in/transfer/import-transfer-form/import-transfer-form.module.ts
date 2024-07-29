import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImportTransferFormPageRoutingModule } from './import-transfer-form-routing.module';

import { ImportTransferFormPage } from './import-transfer-form.page';
import { DateDropdownModule } from 'src/app/components/date-dropdown/date-dropdown.module';
import {TranslateModule} from "@ngx-translate/core";
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        ImportTransferFormPageRoutingModule,
        DateDropdownModule,
        TranslateModule.forChild()
    ],
  declarations: [ImportTransferFormPage]
})
export class ImportTransferFormPageModule {}
