import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { IonicModule } from '@ionic/angular';

import { CompanyEditPageRoutingModule } from './company-edit-routing.module';

import { CompanyEditPage } from './company-edit.page';
import {TranslateModule} from "@ngx-translate/core";
import { CountryModalModule } from 'src/app/components/country-modal/country-modal.module';

@NgModule({
    imports: [
      CKEditorModule,
      CommonModule,
      ReactiveFormsModule,
      FormsModule,
      CountryModalModule,
      IonicModule,
      CompanyEditPageRoutingModule,
      TranslateModule
    ],
  declarations: [CompanyEditPage]
})
export class CompanyEditPageModule {}
