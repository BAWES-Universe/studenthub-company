import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransferListPageRoutingModule } from './transfer-list-routing.module';

import { TransferListPage } from './transfer-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransferListPageRoutingModule
  ],
  declarations: [TransferListPage]
})
export class TransferListPageModule {}
