import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from 'src/app/pipes/pipes.module';

import { NoteComponent } from './note.component';
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
    declarations: [NoteComponent],
    imports: [
        CommonModule,
        IonicModule,
        PipesModule,
        TranslateModule
    ],
    exports: [NoteComponent]
})
export class NoteModule { }
