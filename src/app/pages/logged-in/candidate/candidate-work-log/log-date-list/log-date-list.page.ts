import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { format } from 'date-fns';
import {
  CalendarModal,
  CalendarModalOptions,
  DayConfig,
  CalendarResult,
  CalendarComponentOptions
} from 'ion2-calendar';
// services
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { CandidateService } from 'src/app/providers/logged-in/candidate.service'; 
// models
import {Candidate, CandidateWorkingDate } from 'src/app/models/candidate';
import { DatePickerComponent } from 'src/app/components/date-picker/date-picker.component';
import { AlertController, ModalController, PopoverController, ToastController } from '@ionic/angular';
import { RejectWorkLogPage } from '../../reject-work-log/reject-work-log.page';
import { ApproveWorkLogPage } from '../../approve-work-log/approve-work-log.page';
import { CandidateWorkHistory } from 'src/app/models/candidate-work-history';
 

@Component({
  selector: 'app-log-date-list-page',
  templateUrl: './log-date-list.page.html',
  styleUrls: ['./log-date-list.page.scss'],
})
export class LogDateListPage implements OnInit {

  public loading = false;

  public pageCount = 0;
  public currentPage = 1;
  public totalCount = 0;
  public candidate_id: any;

  public candidateWorkingDates: CandidateWorkingDate[] = [];

  public end_date;
  public start_date;
  public startDateFormatted;
  public endDateFormatted;

  arr_cwd_uuid : string[] = [];

  successMsg;
  warningMsg;

  public candidate: Candidate;

  constructor(
    public candidateService: CandidateService,
    public translateService: TranslateLabelService,
    public activateRoute: ActivatedRoute,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
    public analyticService: AnalyticsService
  ) { }

  ngOnInit() {
    this.candidate_id = this.activateRoute.snapshot.paramMap.get('candidate_id');
    this.analyticService.page('Candidate Working Hours');
  }

  ionViewWillEnter() {
    this.loadData();
    this.loadProfile();
  }

  loadProfile() {
    this.candidateService.view(this.candidate_id).subscribe(res => {
      this.candidate = res;
    })
  }

  ionViewWillLeave() {
    this.analyticService.track('page_exit', {
      'page': 'Candidate Working Hours'
    });
  }

  doRefresh(event) {
    this.loadData();
    event.target.complete();
  }

  async openCalendar() {
    const options: CalendarModalOptions = {
      canBackwardsSelected: true,
      pickMode: 'range',
      title: '',
      defaultScrollTo : new Date(this.end_date ? this.end_date : new Date()),
      defaultDateRange: {
        from: new Date(this.start_date ? this.start_date : ''),
        to: new Date(this.end_date ? this.end_date : '')
      }
    };

    const myCalendar = await this.modalCtrl.create({
      component: CalendarModal,
      componentProps: { options }
    });

    myCalendar.present();

    const event: any = await myCalendar.onDidDismiss();
    const date = event.data;
    if (date) {
      const from: CalendarResult = date.from;
      const to: CalendarResult = date.to;
      if (from.string) {
        this.start_date = from.string;
        this.startDateFormatted = format(from.dateObj, 'dd/MM/yyyy');
      }
      if (to.string) {
        this.end_date = to.string;
        this.endDateFormatted = format(to.dateObj, 'dd/MM/yyyy');
      }

      if (from.string || to.string) {
        this.loadData();
      }
    }
  }

  async selectEndDate(event)  {
    
    //window.history.pushState({ navigationId: window.history.state.navigationId }, "", window.location.pathname);

    const modal = await this.popoverCtrl.create({
      component: DatePickerComponent, 
      event: event,
      componentProps: { 
        dateFormatted: this.endDateFormatted,
        date: this.end_date
      }
    });
    modal.onDidDismiss().then(e => {

      /*if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }*/
 
      if (e.data && e.data.date) {
        this.endDateFormatted = e.data.dateFormatted;
        this.end_date = e.data.date;

        if (this.start_date && this.end_date) {
          this.loadData();
        }
      }
    });
    modal.present();
  }

  async selectStartDate(event) {
     
    //window.history.pushState({ navigationId: window.history.state.navigationId }, "", window.location.pathname);

    const modal = await this.popoverCtrl.create({
      component: DatePickerComponent, 
      event: event,
      componentProps: { 
        dateFormatted: this.startDateFormatted,
        date: this.start_date
      }
    });
    modal.onDidDismiss().then(e => {

      /*if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }*/
 
      if (e.data && e.data.date) {
        this.startDateFormatted = e.data.dateFormatted;
        this.start_date = e.data.date;

        if (this.start_date && this.end_date) {
          this.loadData();
        }
      }
    });
    modal.present();
  }

  getUrlParams() {
    let url = '&expand=&candidate_id=' + this.candidate_id;
     // "&store_id=" + this.history.store_id;

    if (this.start_date) {
      url += "&start_date=" + this.start_date;
    }
  
    if (this.end_date) {
      url += "&end_date=" + this.end_date;
    }

    return url;
  }

  /**
   * load invitations for request
   */
  loadData() {
    this.loading = true; 
    this.candidateService.listCandidateWorkingDates(this.currentPage, this.getUrlParams()).subscribe(response => {
      this.loading =  false;
      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));
      this.candidateWorkingDates = response.body;
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
    
    this.candidateService.listCandidateWorkingDates(this.currentPage, this.getUrlParams()).subscribe(response => {

        this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
        this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
        this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));
        this.candidateWorkingDates = this.candidateWorkingDates.concat(response.body);
        event.target.complete();
    },
    error => { },
    () => {
      this.loading = false;
    });
  }

  toggleSelection(candidateWorkingDate) {
    //event.preventDefault();
    //event.stopPropagation();

    setTimeout(() => {
      if (this.arr_cwd_uuid.indexOf(candidateWorkingDate.cwd_uuid) > -1) {
        this.arr_cwd_uuid = this.arr_cwd_uuid.filter(e => e != candidateWorkingDate.cwd_uuid);
      } else {
        this.arr_cwd_uuid.push(candidateWorkingDate.cwd_uuid)
      }
    }, 200);
  }

  selectAll() {
    this.candidateWorkingDates.forEach((candidateWorkingDate: any) => {
      if (this.arr_cwd_uuid.indexOf(candidateWorkingDate.cwd_uuid) == -1) {
        this.arr_cwd_uuid.push(candidateWorkingDate.cwd_uuid);
      }
    });
  }

  async reject() {

    const alertConfirm = await this.alertCtrl.create({
      header: this.translateService.transform('Are you sure you want to reject all?'),
      subHeader: this.translateService.transform('Make sure to confirm your action as this will affect all selected work hours.'),
      buttons: [
        {
          text: this.translateService.transform('Cancel'),
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: this.translateService.transform('Reject'),
          cssClass: 'danger',
          handler: async (data) => {
           // window.history.pushState({ navigationId: window.history.state.navigationId }, "", window.location.pathname);

            const modal = await this.modalCtrl.create({
              component: RejectWorkLogPage,
              initialBreakpoint: 0.5,
              breakpoints: [0, 0.25, 0.5, 0.75],
              cssClass: "footer-modal reject-work-log-modal",
              componentProps: { 
                candidate_id: this.candidate_id,
                //dates can be from different stores
                //store_id: this.candidate.store_id,
                arr_cwd_uuid: this.arr_cwd_uuid
              }
            });
            modal.onDidDismiss().then(e => {
        
              /*if (!e.data || e.data.from != 'native-back-btn') {
                window['history-back-from'] = 'onDidDismiss';
                window.history.back();
              }*/
        
              if(e.data && e.data.refresh) {       
                this.loadData();
        
                if(e.data.message) {
                  this.warningMsg = e.data.message;
                  setTimeout(() => {
                    this.warningMsg = null;
                  }, 5000);
                }

                this.arr_cwd_uuid = [];
              }
            });
            modal.present();
          }
        }
      ]
    });
    alertConfirm.present();
  }

  async approve() {

    const alertConfirm = await this.alertCtrl.create({
      header: this.translateService.transform('Are you sure you want to approve all?'),
      subHeader: this.translateService.transform('Make sure to confirm your action as this will affect all selected work hours.'),
      buttons: [
        {
          text: this.translateService.transform('Cancel'),
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: this.translateService.transform('Approve'),
          handler: async (data) => {
            
            //window.history.pushState({ navigationId: window.history.state.navigationId }, "", window.location.pathname);

            const modal = await this.modalCtrl.create({
              component: ApproveWorkLogPage, 
              initialBreakpoint: 0.5,
              breakpoints: [0, 0.25, 0.5, 0.75],
              cssClass: "footer-modal approve-work-log-modal",
              componentProps: { 
                candidate_id: this.candidate_id,
                //dates can be from different stores
                //store_id: this.candidate.store_id,
                candidate: this.candidate,
                arr_cwd_uuid: this.arr_cwd_uuid
              }
            });
            modal.onDidDismiss().then(e => {
        
              /*if (!e.data || e.data.from != 'native-back-btn') {
                window['history-back-from'] = 'onDidDismiss';
                window.history.back();
              }*/
        
              if(e.data && e.data.refresh) {       
                this.loadData();
        
                if(e.data.message) {
                  this.successMsg = e.data.message;
                  setTimeout(() => {
                    this.successMsg = null;
                  }, 5000);
                }

                this.arr_cwd_uuid = [];
              }
            });
            modal.present();
          }
        }
      ]
    });
    alertConfirm.present();
  }

}

