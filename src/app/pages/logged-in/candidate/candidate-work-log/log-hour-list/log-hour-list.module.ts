import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { LogHourListPageRoutingModule } from './log-hour-list-routing.module';

import { LogHourListPage } from './log-hour-list.page';
import { LoadingModalModule } from 'src/app/components/loading-modal/loading-modal.module';
import {PipesModule} from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    LoadingModalModule,
    PipesModule,
    LogHourListPageRoutingModule
  ],
  declarations: [
    LogHourListPage
  ]
})
export class LogHourListPageModule {}
