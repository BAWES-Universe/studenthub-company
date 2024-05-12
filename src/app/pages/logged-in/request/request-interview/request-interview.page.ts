import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
//models
import { Candidate } from 'src/app/models/candidate';
import { RequestApplication } from 'src/app/models/request-application';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { AuthService } from 'src/app/providers/auth.service';
//services
import { CompanyRequestService } from 'src/app/providers/logged-in/company-request.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';


@Component({
  selector: 'app-request-interview',
  templateUrl: './request-interview.page.html',
  styleUrls: ['./request-interview.page.scss'],
})
export class RequestInterviewPage implements OnInit {

  candidate: Candidate;
  application: RequestApplication;

  public loading: boolean =false;

  public form: FormGroup;
  
  public borderLimit = false;

  public todayDate; 

  constructor(
    private fb: FormBuilder,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public authService: AuthService,
    public analyticService: AnalyticsService,
    public translateService: TranslateLabelService,
    public requestService: CompanyRequestService
  ) { }

  ngOnInit() {
    this.analyticService.page('Request Interview Page');

    this.todayDate = new Date().toISOString();

    this.initForm();
  }

  ionViewWillLeave() {
    this.analyticService.track('page_exit', {
      'page': 'Request Interview Page'
    });  
  }

  initForm() {
    this.form = this.fb.group({
      application_uuid: [this.application.application_uuid, Validators.required],
      request_uuid: [this.application.request_uuid, Validators.required],
      candidate_id: [this.candidate ? this.candidate.candidate_id : null],
      interview_at: [this.todayDate, Validators.required],
      internal_note: ["", Validators.required],
    });
  }

  submit() {

    this.loading = true; 

    const params = this.form.value; 

    params.interview_at = format(parseISO(this.form.controls['interview_at'].value), 'yyyy-MM-dd HH:mm:ss');//, { timeZone: '+3:30' }

    console.log(this.form.value, params);

    this.requestService.requestInterview(params).subscribe(async res => {
      this.loading = false; 

      if(res.operation == "success") {
        this.dismiss(res);
      } 

      const prompt = await this.alertCtrl.create({
        message: this.authService.errorMessage(res.message),
        buttons: [this.translateService.transform('Okay')]
      });
      prompt.present();
    }, () => {
      this.loading = false;
    })
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  dismiss(data = {}) {
    this.modalCtrl.dismiss(data);
  }
}
