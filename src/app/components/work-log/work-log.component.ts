import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController } from '@ionic/angular';
//services
import { CandidateWorkLogFeedbackService } from 'src/app/providers/logged-in/candidate-work-log-feedback.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';


@Component({
  selector: 'app-work-log',
  templateUrl: './work-log.component.html',
  styleUrls: ['./work-log.component.scss'],
})
export class WorkLogComponent implements OnInit {

  @Input() public hour;

  @Output() onApproveClicked: EventEmitter<any> = new EventEmitter();
  @Output() onRejectClicked: EventEmitter<any> = new EventEmitter();
  @Output() onUndoClicked: EventEmitter<any> = new EventEmitter();

  public loading: boolean = false;

  constructor(
    private _alertCtrl: AlertController,
    public cwhfService: CandidateWorkLogFeedbackService,
    public translateService: TranslateLabelService
  ) { }

  ngOnInit() {
  }
 
  undoFeedback() {
    this.loading = true; 

    this.cwhfService.undo(this.hour).subscribe(async res => {
      this.loading = false;
      
      if (res.operation == "success") {
        this.hour.status = 0;
        this.onUndoClicked.emit();
      }else {

        let alert = await this._alertCtrl.create({
          header: this.translateService.transform('Error'),
          message: this.translateService.errorMessage(res.message),
          buttons: [this.translateService.transform('Okay')],
        });
        alert.present();
      }
    });
  }
}
