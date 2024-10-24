import { Component, Input, OnInit } from '@angular/core';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';

@Component({
  selector: 'app-work-log-date',
  templateUrl: './work-log-date.component.html',
  styleUrls: ['./work-log-date.component.scss'],
})
export class WorkLogDateComponent implements OnInit {

  @Input() public candidateWorkingDate;
  
  constructor(
    public translateService: TranslateLabelService
  ) { }

  ngOnInit() {}

}
