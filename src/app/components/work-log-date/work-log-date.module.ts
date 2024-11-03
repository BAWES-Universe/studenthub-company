import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { WorkLogDateComponent } from './work-log-date.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [WorkLogDateComponent],
  imports: [
    IonicModule,
    PipesModule,
    CommonModule,
    RouterModule,
    TranslateModule.forChild()
  ],
  exports: [
    WorkLogDateComponent
  ]
})
export class WorkLogDateModule { }
