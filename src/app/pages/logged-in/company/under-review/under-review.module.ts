import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UnderReviewPageRoutingModule } from './under-review-routing.module';

import { UnderReviewPage } from './under-review.page';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { CompanyHeaderModule } from 'src/app/components/company-header/company-header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    CompanyHeaderModule,
    RouterModule,
    UnderReviewPageRoutingModule
  ],
  declarations: [UnderReviewPage]
})
export class UnderReviewPageModule {}
