import {Component, Input, OnInit} from '@angular/core';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';

@Component({
  selector: 'app-recent-activity',
  templateUrl: './recent-activity.component.html',
  styleUrls: ['./recent-activity.component.scss'],
})
export class RecentActivityComponent implements OnInit {

  @Input() activity;
  
  @Input() request;

  constructor(public translateService: TranslateLabelService) { }

  ngOnInit(
    
  ) {}

  doNothing(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * format date for safari
   * @param value
   */
  toDate(value) {
    if(!value) return;

    return new Date(value.replace(/-/g, '/') + ' UTC');
  }
}
