import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ServerErrorPage } from './server-error.page';
import {TranslateModule} from "@ngx-translate/core";


const routes: Routes = [
  {
    path: '',
    component: ServerErrorPage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        TranslateModule.forChild()
    ],
  declarations: [ServerErrorPage]
})
export class ServerErrorPageModule {}
