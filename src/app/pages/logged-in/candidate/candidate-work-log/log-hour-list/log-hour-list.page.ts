import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavController, Platform, IonContent } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import {ActivatedRoute} from '@angular/router';
// services
import { AuthService } from 'src/app/providers/auth.service';
import { EventService } from 'src/app/providers/event.service';
import { CandidateWorkingHourService } from 'src/app/providers/logged-in/candidate-working-hour.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
// models
import { CandidateWorkingHour } from 'src/app/models/candidate';
//pages 
import { ApproveWorkLogPage } from '../../approve-work-log/approve-work-log.page';
import { RejectWorkLogPage } from '../../reject-work-log/reject-work-log.page';


declare var window;

@Component({
  selector: 'app-log-hour-list-page',
  templateUrl: './log-hour-list.page.html',
  styleUrls: ['./log-hour-list.page.scss'],
})
export class LogHourListPage implements OnInit {

  public loading = false;

  public pageCount = 0;
  public currentPage = 1;
  public totalCount = 0;
  public totalHours = 0;
  
  public date;
  public store_id: number;
  public candidate_id : any;

  public candidateWorkingHourData: CandidateWorkingHour[];

  public stats: any; 

  public warningMsg; 
  public successMsg;

  constructor(
    public platform: Platform,
    public activateRoute: ActivatedRoute,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public authService: AuthService,
    public translateService: TranslateLabelService,
    public candidateWorkingHour: CandidateWorkingHourService,
    public eventService: EventService,
    public analyticService: AnalyticsService
  ) { }

  ngOnInit() {
    this.date = this.activateRoute.snapshot.paramMap.get('date');
    this.candidate_id = this.activateRoute.snapshot.paramMap.get('candidate_id');
    this.store_id = parseInt(this.activateRoute.snapshot.paramMap.get('store_id'));

    this.analyticService.page('Candidate Working Hours');
  }

  ionViewWillEnter() {
    this.loadData();
    this.loadStats();
  }

  loadStats() {
    this.candidateWorkingHour.stats(this.getUrlParams()).subscribe(response => {
      this.stats = response;
    });
  }

  ionViewWillLeave() {
    this.analyticService.track('page_exit', {
      'page': 'Candidate Working Hours'
    });
  }

  /**
   * load invitations for request
   */
  loadData() {
    this.loading = true;
     
    this.candidateWorkingHour.listByHour(this.currentPage, this.getUrlParams()).subscribe(response => {
      this.loading =  false;
      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));
      this.candidateWorkingHourData = response.body;
    });
  }

  /**
   * broadcast scroll event
   * @param e
   */
  logScrolling(e) {
    // this.eventService.tabScrolled$.next({ scrollTop: e.detail.scrollTop });
  }

  /**
   * load more data on scroll to bottom
   * @param event
   */
  doInfinite(event) {

    this.loading = true;

    this.currentPage++;
    
    this.candidateWorkingHour.listByHour(this.currentPage, this.getUrlParams()).subscribe(response => {

        this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
        this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
        this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));

        this.candidateWorkingHourData = this.candidateWorkingHourData.concat(response.body);
         
        event.target.complete();
    },
    error => { },
    () => {
      this.loading = false;
    });
  }

  getUrlParams() { 
    return "&date=" + this.date + "&store_id=" + this.store_id +
      "&candidate_id=" + this.candidate_id;
    //format(parseISO(this.date), 'yyyy-MM-dd')   
  }

  async approve() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, "", window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: ApproveWorkLogPage, 
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.25, 0.5, 0.75],
      cssClass: "footer-modal approve-work-log-modal",
      componentProps: { 
        candidate_id: this.candidate_id,
        date: this.date,
        store_id: this.store_id
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if(e.data && e.data.refresh) {       
        this.loadStats();

        if(e.data.message) {
          this.successMsg = e.data.message;
        }
      }
    });
    modal.present();
  }
  
  async reject() {
    window.history.pushState({ navigationId: window.history.state.navigationId }, "", window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: RejectWorkLogPage,
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.25, 0.5, 0.75],
      cssClass: "footer-modal reject-work-log-modal",
      componentProps: { 
        candidate_id: this.candidate_id,
        date: this.date,
        store_id: this.store_id
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if(e.data && e.data.refresh) {       
        this.loadStats();

        if(e.data.message) {
          this.warningMsg = e.data.message;
        }
      }
    });
    modal.present();
  }
}
