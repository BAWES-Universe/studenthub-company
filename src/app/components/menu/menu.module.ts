import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { MenuComponent } from './menu.component';
import { CommonModule } from "@angular/common";
import { RouterModule } from '@angular/router';
// import { CommonModule } from '../../app/common.module';

@NgModule({
  declarations: [
    MenuComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ],
  exports: [
    MenuComponent
  ]
})
export class MenuModule { }
