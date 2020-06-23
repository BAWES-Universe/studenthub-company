import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoreViewPageRoutingModule } from './store-view-routing.module';

import { StoreViewPage } from './store-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoreViewPageRoutingModule
  ],
  declarations: [StoreViewPage]
})
export class StoreViewPageModule {}
