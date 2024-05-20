import { Pipe, PipeTransform } from '@angular/core';
//services
import { TranslateLabelService } from '../providers/translate-label.service';


@Pipe({
	name: 'candidateAge',
	pure: false
})
export class CandidateAgePipe implements PipeTransform {

    public timer: number;

    constructor(
      public translate: TranslateLabelService
    ) {}

    transform(value: string) {
      
      const d = (value) ? new Date(value.replace(/-/g, '/') + ' GMT+03:00') : new Date();
      
      const now = new Date();
      const seconds = Math.round(Math.abs((now.getTime() - d.getTime()) / 1000));

      const minutes = Math.round(Math.abs(seconds / 60));
      const hours = Math.round(Math.abs(minutes / 60));
      const days = Math.round(Math.abs(hours / 24));
      // let months = Math.round(Math.abs(days/30.416));
      const years = Math.floor(Math.abs(days / 365));

      if (Number.isNaN(seconds)){
        return '';
      } else if (days <= 545) {
        return this.translate.transform('a year old');
      } else { // (days > 545)
        return this.translate.transform("txt_years_old", { value: years });
      }
    }
}

