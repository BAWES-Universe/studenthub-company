import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { LogHourListPageRoutingModule } from './log-hour-list-routing.module';

import { LogHourListPage } from './log-hour-list.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import {PipesModule} from 'src/app/pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { NoItemsModule } from 'src/app/components/no-items/no-items.module';
import { ApproveWorkLogPageModule } from '../../approve-work-log/approve-work-log.module';
import { RejectWorkLogPageModule } from '../../reject-work-log/reject-work-log.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    LoadingModalModule,
    PipesModule,
    NoItemsModule,
    ApproveWorkLogPageModule,
    RejectWorkLogPageModule,
    TranslateModule.forChild(),
    LogHourListPageRoutingModule
  ],
  declarations: [
    LogHourListPage
  ]
})
export class LogHourListPageModule {}
