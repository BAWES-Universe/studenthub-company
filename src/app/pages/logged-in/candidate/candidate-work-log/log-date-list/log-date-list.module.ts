import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { LogDateListPageRoutingModule } from './log-date-list-routing.module';

import { LogDateListPage } from './log-date-list.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import {PipesModule} from 'src/app/pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { NoItemsModule } from 'src/app/components/no-items/no-items.module';
import { WorkLogDateModule } from 'src/app/components/work-log-date/work-log-date.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    LoadingModalModule,
    PipesModule,
    NoItemsModule,
    WorkLogDateModule,
    TranslateModule.forChild(),
    LogDateListPageRoutingModule
  ],
  declarations: [
    LogDateListPage
  ]
})
export class LogDateListPageModule {}
