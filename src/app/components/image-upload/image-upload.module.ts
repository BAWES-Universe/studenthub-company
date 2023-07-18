import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import {ImageUploadComponent} from './image-upload.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    ImageUploadComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild()
  ],
  exports: [
    ImageUploadComponent,
  ]
})
export class ImageUploadModule { }

