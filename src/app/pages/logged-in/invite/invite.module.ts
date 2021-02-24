import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvitePageRoutingModule } from './invite-routing.module';

import { InvitePage } from './invite.page';
import { RequestListingModule } from 'src/app/components/request-listing/request-listing.module';
import {NoItemsModule} from "../../../components/no-items/no-items.module";
import {LoadingModalModule} from "../../../components/loading-modal/loading-modal.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RequestListingModule,
    InvitePageRoutingModule,
    NoItemsModule,
    LoadingModalModule
  ],
  declarations: [InvitePage]
})
export class InvitePageModule {}
