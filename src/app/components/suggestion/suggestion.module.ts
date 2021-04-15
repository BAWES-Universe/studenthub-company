import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SuggestionComponent } from './suggestion.component';
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
    declarations: [SuggestionComponent],
    imports: [
        CommonModule,
        IonicModule,
        RouterModule,
        PipesModule,
        TranslateModule
    ],
    exports: [SuggestionComponent]
})
export class SuggestionModule { }
