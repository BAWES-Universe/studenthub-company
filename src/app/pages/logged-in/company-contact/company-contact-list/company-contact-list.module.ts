import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompanyContactListPageRoutingModule } from './company-contact-list-routing.module';

import { CompanyContactListPage } from './company-contact-list.page';

import { NoItemsModule } from 'src/app/components/no-items/no-items.module';
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        NoItemsModule,
        CompanyContactListPageRoutingModule,
        TranslateModule
    ],
  declarations: [CompanyContactListPage]
})
export class CompanyContactListPageModule {}
