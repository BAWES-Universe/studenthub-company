import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { UpdatePasswordPage } from './update-password.page';

const routes: Routes = [
  {
    path: '',
    component: UpdatePasswordPage
  },
  {
    path: ':token',
    component: UpdatePasswordPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UpdatePasswordPage]
})
export class UpdatePasswordPageModule {}
