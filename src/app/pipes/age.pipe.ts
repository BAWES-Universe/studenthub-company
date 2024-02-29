import { Pipe, PipeTransform } from "@angular/core";
//services
import { TranslateLabelService } from "../providers/translate-label.service";


@Pipe({
	name: 'age',
})
export class AgePipe implements PipeTransform {

    public timer: number;

    constructor(
		public translate: TranslateLabelService
    ) {}

	transform(value: number) {
	
        if(!value) {
        	return 0;
        }

        let now = new Date();
		
		let seconds = Math.round(Math.abs((now.getTime()/1000) - value));
		
        let minutes = Math.round(Math.abs(seconds / 60));
		let hours = Math.round(Math.abs(minutes / 60));
		let days = Math.round(Math.abs(hours / 24));
		let months = Math.round(Math.abs(days/30.416));
		let years = Math.round(Math.abs(days/365));

		if (Number.isNaN(seconds)){
			return '';
		} else if (seconds <= 45) {
			return this.translate.transform('a few seconds');
		} else if (seconds <= 90) {
			return this.translate.transform('a minute');
		} else if (minutes <= 45) {
			return this.translate.transform("txt_minutes", { value: minutes });
		} else if (minutes <= 90) {
			return this.translate.transform('an hour');
		} else if (hours <= 22) {
			return this.translate.transform("txt_hours", { value: hours });
		} else if (hours <= 36) {
			return this.translate.transform('a day');
		} else if (days <= 25) {
			return this.translate.transform("txt_days", { value: days });
		} else if (days <= 45) {
			return this.translate.transform('a month');
		} else if (days <= 345) {
			return this.translate.transform("txt_months", { value: months });
		} else if (days <= 545) {
			return this.translate.transform('a year');
		} else { // (days > 545)
			return this.translate.transform("txt_years", { value: years });
		}
    }
}

