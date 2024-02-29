import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
//pages
import { VerifyEmailPage } from './verify-email.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


const routes: Routes = [
  {
    path: '',
    component: VerifyEmailPage
  }
];

@NgModule({
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule.forChild(),
    RouterModule.forChild(routes)
  ],
  declarations: [VerifyEmailPage]
})
export class VerifyEmailPageModule {}
