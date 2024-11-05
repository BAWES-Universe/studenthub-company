import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AlertController, ModalController, NavController, Platform} from '@ionic/angular';
// models
import { Candidate } from 'src/app/models/candidate';
// services
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
import { AwsService } from 'src/app/providers/aws.service';
import { AuthService } from 'src/app/providers/auth.service';
import {InvitePage} from "../../invite/invite.page";
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { RequestApplication } from 'src/app/models/request-application';
import { ChatService } from 'src/app/providers/logged-in/chat.service';



@Component({
  selector: 'app-candidate-view',
  templateUrl: './candidate-view.page.html',
  styleUrls: ['./candidate-view.page.scss'],
})
export class CandidateViewPage implements OnInit {

  public startingChat: boolean = false; 

  public candidate: Candidate;
  public candidate_id;
  public workHistory: any[] = [];
  public loading = false;

  public borderLimit;

  public loadingApplications: boolean = false; 

  public candidateApplications: RequestApplication[] = [];
  
  public applicationPageCount = 0;
  public applicationCurrentPage  = 0;
  public applicationTotal = 0;
  
  public segment: string = 'details';

  constructor(
    public platform: Platform,
    public aws: AwsService,
    public activatedRoute: ActivatedRoute,
    public candidateService: CandidateService,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public translateService: TranslateLabelService,
    public authService: AuthService,
    public modalCtrl: ModalController,
    public chatService: ChatService,
    public analyticService: AnalyticsService
  ) { }

  /**
   * Load candidate work history data
   */
  loadWorkHistoryData() {
    this.candidateService.workHistory(this.candidate_id).subscribe(response => {
      this.workHistory = response;
    });
  }

  ngOnInit() {
    this.analyticService.page('Candidate View Page');

    this.candidate_id = this.activatedRoute.snapshot.paramMap.get('id');

    const state = window.history.state;

    if (state.model) {
      this.candidate = state.model;
    }

    this.loadData();

    this.loadWorkHistoryData();
  }

  ionViewWillLeave() {
    this.analyticService.track('page_exit', {
      'page': 'Candidate View Page'
    });
  }

  async loadData() {
    // Load list of ALL stores
    this.loading = true;
    this.candidateService.view(this.candidate_id).subscribe(response => {
      if (!response) {
        this.navCtrl.back();
      }
      this.candidate = response;
      this.loading = false;
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  onPhotoError(candidate) {
    candidate.candidate_personal_photo = null;
  }
  /**
   * Make date readable by Safari
   * @param date
   */
  toDate(date) {
    if (date) {
      return new Date(date.replace(/-/g, '/'));
    }
  }

  onCivilBackError(candidate) {
    candidate.candidate_civil_photo_back = null;
  }
  onCivilFrontError(candidate) {
    candidate.candidate_civil_photo_front = null;
  }
  getResumeUrl(candidate) {
    return this.aws.permanentBucketUrl + 'candidate-resume/' + encodeURIComponent(candidate.candidate_resume);
  }

  area(area, country) {
    return `${area.area_name_en } ${country.country_name_en}`;
  }

  /**
   * invite candidate for open request
   */
  async invite() {

    if(!this.authService.company.company_approved_to_hire) {
      
      let prompt = await this.alertCtrl.create({
        message: this.translateService.transform("We've not approved to invite candidate, please contact us for assistance."),
        buttons: [this.translateService.transform('Okay')]
      });
      return prompt.present();
    }

   // window.history.pushState({ navigationId: window.history.state.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: InvitePage,
      componentProps: {
        candidate: this.candidate
      }
    });
    modal.onDidDismiss().then(e => {

      /*if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }*/

      if (e.data && e.data.refresh && e.data.invitedCount) {
        // this.loadNotes();
        this.candidate.invitedCount = e.data.invitedCount;
      }
    });
    await modal.present();
  }


  loadApplications() {
 
    this.loadingApplications = true;

    this.applicationCurrentPage = 1;

    this.candidateService.listApplications(this.candidate_id, this.applicationCurrentPage).subscribe(data => {

      this.candidateApplications = data.body;
      this.applicationPageCount = parseInt(data.headers.get('X-Pagination-Page-Count'));
      this.applicationCurrentPage = parseInt(data.headers.get('X-Pagination-Current-Page'));
      this.applicationTotal = parseInt(data.headers.get('X-Pagination-Total-Count'));
    },
    () => { },
    () => {
      this.loadingApplications = false;
    });
  }

  /**
   * load more on scroll to bottom
   * @param event 
   */
  doInfiniteApplications(event) {

    this.loadingApplications = true;

    this.applicationCurrentPage++;

    this.candidateService.listApplications(this.candidate_id, this.applicationCurrentPage).subscribe(data => {

      this.candidateApplications = data.body;
      this.applicationPageCount = parseInt(data.headers.get('X-Pagination-Page-Count'));
      this.applicationCurrentPage = parseInt(data.headers.get('X-Pagination-Current-Page'));
      this.applicationTotal = parseInt(data.headers.get('X-Pagination-Total-Count'));
    },
    () => { },
    () => {
      this.loadingApplications = false;
      event.target.complete();
    });
  }

  segmentChanged(event) {
    if(this.segment != event.target.value)
      this.segment = event.target.value;

    if(this.segment == "applications" && this.applicationTotal == 0) {
      this.loadApplications();
    }
  }


  doRefresh(event) {
    switch (this.segment) {
      case "details":
        this.loadData();
        break;
      case "applications":
        this.loadApplications();
        break;
      default:
        break;
    }

    event.target.complete();
  }  

  applicationSelected(request) {
    this.navCtrl.navigateForward('/request-view/' + request.request_uuid, {
      state : {
        from: 'company-request-list'
      }
    });
  }

  startChat() {
    this.startingChat = true; 

    this.chatService.startChat(this.candidate_id).subscribe(async res => {
      this.startingChat = false; 
    
      if (res.operation == "error") {
        let prompt = await this.alertCtrl.create({
          message: this.translateService.errorMessage(res.message),
          buttons: [this.translateService.transform('Okay')]
        });
        return prompt.present();
      }
      else 
      {
        this.navCtrl.navigateForward('/chat-view/' + res.chat.chat_uuid);
      }
    });
  }
}
