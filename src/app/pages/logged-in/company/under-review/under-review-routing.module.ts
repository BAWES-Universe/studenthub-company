import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UnderReviewPage } from './under-review.page';

const routes: Routes = [
  {
    path: '',
    component: UnderReviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnderReviewPageRoutingModule {}
