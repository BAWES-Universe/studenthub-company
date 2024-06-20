import { LoadingModalComponent } from "./loading-modal.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { NgModule } from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
  declarations: [
    LoadingModalComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule.forChild()
    ],
  exports: [
    LoadingModalComponent,
  ]
})
export class LoadingModalModule { }

