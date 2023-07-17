import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivatePageRoutingModule } from './activate-routing.module';

import { ActivatePage } from './activate.page';
import { ImageUploadModule } from 'src/app/components/image-upload/image-upload.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImageUploadModule,
    ActivatePageRoutingModule
  ],
  declarations: [ActivatePage]
})
export class ActivatePageModule {}
