import { Pipe, PipeTransform } from '@angular/core';
//services
import { TranslateLabelService } from '../providers/translate-label.service';


@Pipe({
	name: 'timeSpent',
})
export class TimeSpentPipe implements PipeTransform {

    public timer: number;

    constructor(
      public translate: TranslateLabelService
    ) {}

	transform(value: number) {

    if (!value) {
      return 0;
    }

    let seconds = 0;
    let minutes = 0;
    let hours = 0;
    let days = 0;
    let months = 0;
    seconds = value;
    if (seconds > 60) {
      minutes = (value / 60);
    }
    if (minutes > 60) {
      hours = (minutes / 60);
    }
    if (hours > 24) {
      days = (hours / 24);
    }
    if (days > 31) {
      months = (days / 31);
    }

    if (months) {
      return this.translate.transform("txt_months", { value: months.toFixed(2) }); 
    }
    if (days) {
      return this.translate.transform("txt_days", { value: days.toFixed(2) }); 
    }
    if (hours) {
      return this.translate.transform("txt_hours", { value: hours.toFixed(2) }); 
    }
    if (minutes) {
      return this.translate.transform("txt_minutes", { value: minutes.toFixed(2) });
    }
    if (seconds) {
      return this.translate.transform("txt_seconds", { value: seconds.toFixed(2) });
    }
  }
}

