import { NgModule } from '@angular/core';
import { GroupByPipe } from './groupby-pipe';
import { SortPipe } from './timestamp-pipe';
import { StoreIdPipe } from './store-id-pipe';
import { TimeAgoPipe } from './timeago.pipe';
import { AgePipe } from './age.pipe';
import {CandidateAgePipe} from './candidate.age.pipe';
import {TimeSpentPipe} from "./timespent.pipe";


// import custom pipes here
@NgModule({
    declarations: [
        GroupByPipe,
        StoreIdPipe,
        SortPipe,
        TimeAgoPipe,
        AgePipe,
        TimeSpentPipe,
        CandidateAgePipe
    ],
    imports: [],
    exports: [
        GroupByPipe,
        StoreIdPipe,
        SortPipe,
        TimeAgoPipe,
        AgePipe,
        TimeSpentPipe,
        CandidateAgePipe
    ]
})
export class PipesModule {}
