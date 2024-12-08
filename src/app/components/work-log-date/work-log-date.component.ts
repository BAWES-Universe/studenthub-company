import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';

@Component({
  selector: 'app-work-log-date',
  templateUrl: './work-log-date.component.html',
  styleUrls: ['./work-log-date.component.scss'],
})
export class WorkLogDateComponent implements OnInit {

  @Input() public candidateWorkingDate;
  @Input() public checked;
  @Output() toggleSelection: EventEmitter<any> = new EventEmitter();

  constructor(
    public translateService: TranslateLabelService
  ) { }

  ngOnInit() {}

  onCheckboxClick(event) {
    event.stopPropagation();
    this.toggleSelection.emit(this.candidateWorkingDate);
  }
}
