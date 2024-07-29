import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { DatePopupComponent } from './date-popup.component';


@NgModule({
    declarations: [DatePopupComponent],
    imports: [
        IonicModule
    ],
    exports: [DatePopupComponent]
})
export class DatePopupModule { }
