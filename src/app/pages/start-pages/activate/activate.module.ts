import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivatePageRoutingModule } from './activate-routing.module';

import { ActivatePage } from './activate.page';
import { ImageUploadModule } from 'src/app/components/image-upload/image-upload.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ImageUploadModule,
    TranslateModule.forChild(),
    ActivatePageRoutingModule
  ],
  declarations: [ActivatePage]
})
export class ActivatePageModule {}
