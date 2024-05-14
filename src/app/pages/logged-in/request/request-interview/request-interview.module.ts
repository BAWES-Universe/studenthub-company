import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestInterviewPageRoutingModule } from './request-interview-routing.module';

import { RequestInterviewPage } from './request-interview.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule,
    RequestInterviewPageRoutingModule
  ],
  declarations: [RequestInterviewPage]
})
export class RequestInterviewPageModule {}
