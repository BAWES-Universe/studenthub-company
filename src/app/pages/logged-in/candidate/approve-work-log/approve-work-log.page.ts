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
  selector: 'app-approve-work-log',
  templateUrl: './approve-work-log.page.html',
  styleUrls: ['./approve-work-log.page.scss'],
})
export class ApproveWorkLogPage implements OnInit {
 

  candidate_id: number;
  date: string; 
  store_id: number; 

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
      status: [1],
      note: ["", Validators.required],
      is_public: ["", Validators.required],
      rating: ["", Validators.required],
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
        
        let alert = await this._alertCtrl.create({
          header: this.translateService.transform('Success'),
          message: res.message,
          buttons: [this.translateService.transform('Okay')],
        });
        alert.present();

        this.form.reset();

        this.close({
          refresh: true
        })

      } else if (res.operation == "error") {

        let alert = await this._alertCtrl.create({
          header: this.translateService.transform('Error'),
          message: res.message,
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
    this.model.is_public = this.form.value.is_public;
    this.model.rating = this.form.value.rating;
  }

  setRating(rating) {
    this.form.controls.rating.setValue(rating);
    this.form.controls.rating.updateValueAndValidity();
  }

}
