import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { IonicModule } from '@ionic/angular';

import { RequestFormPageRoutingModule } from './request-form-routing.module';

import { RequestFormPage } from './request-form.page';
import {TranslateModule} from "@ngx-translate/core";
import { SelectSearchModule } from 'src/app/components/select-search/select-search.module';

@NgModule({
    imports: [
      CKEditorModule,
        CommonModule,
        FormsModule,
        IonicModule,
        SelectSearchModule,
        ReactiveFormsModule,
        RequestFormPageRoutingModule,
        TranslateModule
    ],
  declarations: [RequestFormPage]
})
export class RequestFormPageModule {}
