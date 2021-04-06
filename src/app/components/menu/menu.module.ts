import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { MenuComponent } from './menu.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
// import { CommonModule } from '../../app/common.module';

@NgModule({
  declarations: [
    MenuComponent
  ],
    imports: [
        CommonModule,
        IonicModule,
        RouterModule,
        TranslateModule
    ],
  exports: [
    MenuComponent
  ]
})
export class MenuModule { }
