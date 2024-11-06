import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransferFormMonthlyPageRoutingModule } from './transfer-form-monthly-routing.module';

import { TransferFormMonthlyPage } from './transfer-form-monthly.page';
import { CalendarModule } from 'ion2-calendar';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransferFormMonthlyPageRoutingModule,
    ReactiveFormsModule,
    PipesModule,
    CalendarModule,
    TranslateModule.forChild()
  ],
  declarations: [TransferFormMonthlyPage]
})
export class TransferFormMonthlyPageModule {}
