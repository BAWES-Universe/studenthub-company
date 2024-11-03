import { NgModule } from '@angular/core';
import { GroupByPipe } from './groupby-pipe';
import { SortPipe } from './timestamp-pipe';
import { StoreIdPipe } from './store-id-pipe';
import { TimeAgoPipe } from './timeago.pipe';
import { AgePipe } from './age.pipe';
import {CandidateAgePipe} from './candidate.age.pipe';
import {TimeSpentPipe} from "./timespent.pipe";
import { SecondsToTimePipe } from './secondToTime.pipe';
import { ConvertToBoldPipe } from './convert-to-bold';
import { GroupByMonthPipe } from './groupby-month.pipe';

// import custom pipes here
@NgModule({
    declarations: [
        GroupByMonthPipe,
        GroupByPipe,
        StoreIdPipe,
        SortPipe,
        TimeAgoPipe,
        AgePipe,
        TimeSpentPipe,
        CandidateAgePipe,
        SecondsToTimePipe,
        ConvertToBoldPipe
    ],
    imports: [],
    exports: [
        GroupByMonthPipe,
        GroupByPipe,
        StoreIdPipe,
        SortPipe,
        TimeAgoPipe,
        AgePipe,
        TimeSpentPipe,
        CandidateAgePipe,
        SecondsToTimePipe,
        ConvertToBoldPipe
    ]
})
export class PipesModule {}
