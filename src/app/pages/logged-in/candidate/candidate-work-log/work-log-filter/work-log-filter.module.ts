import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkLogFilterPageRoutingModule } from './work-log-filter-routing.module';

import { WorkLogFilterPage } from './work-log-filter.page';
import { TranslateModule } from '@ngx-translate/core';
import { DatePopupModule } from 'src/app/components/date-popup/date-popup.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatePopupModule,
    TranslateModule.forChild(),
    //WorkLogFilterPageRoutingModule
  ],
  declarations: [WorkLogFilterPage]
})
export class WorkLogFilterPageModule {}
