import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransferFormFixedPageRoutingModule } from './transfer-form-fixed-routing.module';

import { TransferFormFixedPage } from './transfer-form-fixed.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { CalendarModule } from 'ion2-calendar';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransferFormFixedPageRoutingModule,
    ReactiveFormsModule,
    PipesModule,
    CalendarModule,
    TranslateModule.forChild()
  ],
  declarations: [TransferFormFixedPage]
})
export class TransferFormFixedPageModule {}
