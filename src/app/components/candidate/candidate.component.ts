import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
// models
import { Candidate } from 'src/app/models/candidate';
import { RequestApplication } from 'src/app/models/request-application';
import {Invitation} from 'src/app/models/invitation';
// services
import { AwsService } from 'src/app/providers/aws.service';
//pages
import { RequestInterviewPage } from 'src/app/pages/logged-in/request/request-interview/request-interview.page';


@Component({
  selector: 'candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.scss'],
})
export class CandidateComponent implements OnInit {

  @Input() candidate: Candidate;
  @Input() application: RequestApplication;
  @Input() invitation: Invitation;

  constructor(
    public modalCtrl: ModalController,
    public aws: AwsService
  ) {
  }

  ngOnInit() {
  }

  /**
   * on image error
   */
  onImageError() {
    this.candidate.candidate_personal_photo = null;
  }

  /**
   * open popup to select interview datetime
   * @param event 
   */
  async scheduleInterview(event) {

    event.preventDefault();
    event.stopPropagation(); 

   // window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: RequestInterviewPage,
      componentProps: {
        candidate: this.candidate,
        application: this.application
      }
    });
    modal.onDidDismiss().then(e => {

      /*if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }*/

      if (e.data && e.data.requestInterview) {
        this.application.requestInterview = e.data.requestInterview;
      }
    });
    await modal.present();
  }
}
