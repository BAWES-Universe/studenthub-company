import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidateAssignmentPageRoutingModule } from './candidate-assignment-routing.module';

import { CandidateAssignmentPage } from './candidate-assignment.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { DatePickerModule } from 'src/app/components/date-picker/date-picker.module';
import { CalendarModule } from 'ion2-calendar';
import { CandidateOptionComponent } from '../../store/store-list/candidate-option-component';
import { WorkLogDateModule } from 'src/app/components/work-log-date/work-log-date.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    DatePickerModule,
    CalendarModule,
    WorkLogDateModule,
   // SelectSearchPage
   // CandidateOptionModule,
    TranslateModule.forChild(),
    CandidateAssignmentPageRoutingModule
  ],
  declarations: [CandidateAssignmentPage]
})
export class CandidateAssignmentPageModule {}
