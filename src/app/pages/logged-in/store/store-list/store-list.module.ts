import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoreListPageRoutingModule } from './store-list-routing.module';

import { StoreListPage } from './store-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoreListPageRoutingModule
  ],
  declarations: [StoreListPage]
})
export class StoreListPageModule {}
