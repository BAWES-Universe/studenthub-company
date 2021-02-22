import { NgModule } from '@angular/core';
import { GroupByPipe } from './groupby-pipe';
import { SortPipe } from './timestamp-pipe';
import { StoreIdPipe } from './store-id-pipe';
import { TimeAgoPipe } from './timeago.pipe';
import { AgePipe } from './age.pipe';
import {CandidateAgePipe} from './candidate.age.pipe';


// import custom pipes here
@NgModule({
    declarations: [
        GroupByPipe,
        StoreIdPipe,
        SortPipe,
        TimeAgoPipe,
        AgePipe,
        CandidateAgePipe
    ],
    imports: [],
    exports: [
        GroupByPipe,
        StoreIdPipe,
        SortPipe,
        TimeAgoPipe,
        AgePipe,
        CandidateAgePipe
    ]
})
export class PipesModule {}
