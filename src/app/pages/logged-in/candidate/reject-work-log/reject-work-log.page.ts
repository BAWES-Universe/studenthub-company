import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
//models
import { CandidateWorkLogFeedback } from 'src/app/models/candidate-work-log-feedback';
//services
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { CandidateWorkLogFeedbackService } from 'src/app/providers/logged-in/candidate-work-log-feedback.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';


@Component({
  selector: 'app-reject-work-log',
  templateUrl: './reject-work-log.page.html',
  styleUrls: ['./reject-work-log.page.scss'],
})
export class RejectWorkLogPage implements OnInit {

  candidate_id: number;
  date: string; 
  store_id: number; 

  public hour;

  model: CandidateWorkLogFeedback;

  public form: FormGroup;

  public saving: boolean = false; 

  constructor(
    private _alertCtrl: AlertController,
    private _fb: FormBuilder, 
    public modalCtrl: ModalController,
    public analyticsService: AnalyticsService,
    public translateService: TranslateLabelService,
    public cwhfService: CandidateWorkLogFeedbackService
  ) { }

  ngOnInit() {
    this.analyticsService.page('Log manually page');

    this.form = this._fb.group({
      candidate_id: [this.candidate_id, Validators.required],
      store_id: [this.store_id, Validators.required],
      date: [this.date, Validators.required],
      status: [2],
      candidate_working_hour_uuid: [this.hour?.candidate_working_hour_uuid],
      note: [""],//, Validators.required
      reason: ["", Validators.required],
    });
  }

  close(data = {}) {
    this.modalCtrl.dismiss(data);
  }

  async save() {
    this.saving = true; 

    this.updateModelFromForm();

    this.cwhfService.save(this.model).subscribe(async res => {

      this.saving = false;
      
      if (res.operation == "success") {
        
        /*let alert = await this._alertCtrl.create({
          header: this.translateService.transform('Success'),
          message: res.message,
          buttons: [this.translateService.transform('Okay')],
        });
        alert.present();*/

        this.form.reset();

        this.close({
          refresh: true,
          message: res.message
        })

      } else if (res.operation == "error") {

        let alert = await this._alertCtrl.create({
          header: this.translateService.transform('Error'),
          message: this.translateService.errorMessage(res.message),
          buttons: [this.translateService.transform('Okay')],
        });
        alert.present();
      }
    });
  } 

  updateModelFromForm() {

    if(!this.model) 
      this.model = new CandidateWorkLogFeedback;

    this.model.candidate_id = this.form.value.candidate_id;
    this.model.store_id = this.form.value.store_id;
    this.model.date = this.form.value.date;
    this.model.status = this.form.value.status;
    this.model.note = this.form.value.note;
    this.model.reason = this.form.value.reason;
    this.model.candidate_working_hour_uuid = this.form.value.candidate_working_hour_uuid;
  }

  setReason(reason) {
    this.form.controls.reason.setValue(reason);
    this.form.markAsDirty();
    this.form.controls.reason.updateValueAndValidity();
  }
}
