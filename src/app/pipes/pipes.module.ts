import { NgModule } from '@angular/core';
import { GroupByPipe } from './groupby-pipe';
import { SortPipe } from './timestamp-pipe';
import { StoreIdPipe } from './store-id-pipe';


//import custom pipes here
@NgModule({
    declarations: [
        GroupByPipe,
        StoreIdPipe,
        SortPipe
    ],
    imports: [],
    exports: [
        GroupByPipe,
        StoreIdPipe,
        SortPipe
    ]
})
export class PipesModule {}