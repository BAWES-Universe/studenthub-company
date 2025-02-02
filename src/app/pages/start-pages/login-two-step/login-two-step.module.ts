import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginTwoStepPageRoutingModule } from './login-two-step-routing.module';

import { LoginTwoStepPage } from './login-two-step.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule.forChild(),
    ReactiveFormsModule,
    IonicModule,
    LoginTwoStepPageRoutingModule
  ],
  declarations: [LoginTwoStepPage]
})
export class LoginTwoStepPageModule {}
