import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController, PopoverController, ToastController } from '@ionic/angular';
import { format } from 'date-fns';
import {
  CalendarModal,
  CalendarModalOptions,
  DayConfig,
  CalendarResult,
  CalendarComponentOptions
} from 'ion2-calendar';
import { DatePickerComponent } from 'src/app/components/date-picker/date-picker.component';
//models
import { CandidateWorkingHour } from 'src/app/models/candidate';
import { CandidateWorkHistory } from 'src/app/models/candidate-work-history';
//services
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { CandidateWorkingHourService } from 'src/app/providers/logged-in/candidate-working-hour.service';
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
import { StoreService } from 'src/app/providers/logged-in/store.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { CandidateOptionComponent } from '../../store/store-list/candidate-option-component';
import { SelectSearchPageComponent } from 'src/app/components/select-search/select-search-page/select-search-page.component';


@Component({
  selector: 'app-candidate-assignment',
  templateUrl: './candidate-assignment.page.html',
  styleUrls: ['./candidate-assignment.page.scss'],
})
export class CandidateAssignmentPage implements OnInit {
 
  public id;
  
  public loading = false;

  public pageCount = 0;
  public currentPage = 1;
  public totalCount = 0;

  public history: CandidateWorkHistory;

  public candidateWorkingHourData: CandidateWorkingHour[] = [];

  public segment: string = "logs";
  
  public allStores = [];
  
  public end_date;
  public start_date;
  public startDateFormatted;
  public endDateFormatted;

  constructor(
    public popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public activateRoute: ActivatedRoute,
    public storeService: StoreService,
    public candidateService: CandidateService,
    public candidateWorkingHour: CandidateWorkingHourService,
    public analyticsService: AnalyticsService,
    public translateService: TranslateLabelService) { }

  ngOnInit() {
    this.id = this.activateRoute.snapshot.paramMap.get('id');

    this.analyticsService.page('Candidate Assigment');

    //this.loadData();
    this.loadAssignment();
  }

  ionViewWillLeave() {
    this.analyticsService.track('page_exit', {
      'page': 'Candidate Assigment'
    });
  }

  loadAssignment() {
    this.candidateService.workHistoryDetail(this.id).subscribe(res => {
      this.history = res;

      if(this.history)
        this.loadData();
    })
  }

  getUrlParams() {
    let url = '&expand=dateStatus,checkIn,checkOut&candidate_id=' + this.history.candidate_id + 
      "&store_id=" + this.history.store_id;

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
     
    this.candidateWorkingHour.list(this.currentPage, this.getUrlParams()).subscribe(response => {
      this.loading =  false;
      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));
      this.candidateWorkingHourData = response.body;
    });
  }

  /**
   * load more data on scroll to bottom
   * @param event
   */
  doInfinite(event) {

    this.loading = true;

    this.currentPage++;
 
    this.candidateWorkingHour.list(this.currentPage, this.getUrlParams()).subscribe(response => {

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

  doRefresh(event) {

    if (this.segment == "details") {
      this.loadAssignment();
    } else {
      this.loadData();
    }

    event.target.complete();
  }

  segmentChanged(event) {

  }


  /**
   * show candidate option 
   * @param event 
   * @param candidate 
   */
  async candidateOptions(event, candidate) {
    event.stopPropagation();
    event.preventDefault(); 

    const popup = await this.popoverCtrl.create({
      component : CandidateOptionComponent,
      componentProps: {
        candidate: candidate
      },
      event: event,
      translucent: true
    });
    popup.onDidDismiss().then(e => {
     
      if(e && e.data && e.data.action) {
        if(e.data.action == "change-store") {
          this.assingToStore(candidate);
        } else if(e.data.action == "un-assign") {
          this.storeAssignmentRequest(candidate);
        } else if(e.data.action == "cancel-request") {
          this.cancelStoreAssignmentRequest(candidate);
        }
      }
    });
    await popup.present();
  }

  loadAllStores() {
    this.storeService.listByCompanyStore(-1, "").subscribe(response => {
      this.allStores = response.body;
    });
  }

  /**
   * open popup to select store
   * @param ev
   */
  async assingToStore(candidate) {

    /*if(this.allStores.length == 0) {
      this.loadAllStores();
    }*/

    const selectPage = await this.popoverCtrl.create({
      component: SelectSearchPageComponent,
      componentProps: {
        collection: this.allStores,
        valueAttr: 'store_id',
        labelAttr: 'store_name'
      },
      cssClass: 'select_search_store_id',
      // event: ev,
      translucent: true
    });
    selectPage.onDidDismiss().then(e => {

      if (e.data && e.data.store_id != candidate.store_id) {
        this.storeAssignmentRequest(candidate, e.data.store_id);
      }
    });
    await selectPage.present();
  }

  cancelStoreAssignmentRequest(candidate) {
    this.storeService.cancelAssignmentRequest(candidate.storeAssignmentRequest.sar_uuid).subscribe(async response => {
      if( response.operation == "success") {

        candidate.storeAssignmentRequest = null;

        if(response.message) {
          this.toastCtrl.create({
            message: this.translateService.errorMessage(response.message),
            duration: 3000,
          // buttons: ['Okay']
          }).then(prompt => {
            prompt.present();
          });
        }
        
      } else {
        let prompt = await this.alertCtrl.create({
          message: this.translateService.errorMessage(response.message),
          buttons: [this.translateService.transform('Okay')]
        });
        prompt.present();
      }
    }); 
  }

  /**
   * request to change or remove store assignment
   * @param candidate 
   * @param store_id 
   */
  storeAssignmentRequest(candidate, store_id = null) {
    this.storeService.storeAssignmentRequest(candidate.candidate_id, store_id).subscribe(async response => {
      if( response.operation == "success") {
        candidate.storeAssignmentRequest = response.storeAssignmentRequest;

        if(response.message) {
          this.toastCtrl.create({
            message: this.translateService.errorMessage(response.message),
            duration: 3000,
          // buttons: ['Okay']
          }).then(prompt => {
            prompt.present();
          });
        }
        
      } else {
        let prompt = await this.alertCtrl.create({
          message: this.translateService.errorMessage(response.message),
          buttons: [this.translateService.transform('Okay')]
        });
        prompt.present();
      }
    }); 
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
    window.history.pushState({ navigationId: window.history.state.navigationId }, "", window.location.pathname);

    const modal = await this.popoverCtrl.create({
      component: DatePickerComponent, 
      event: event,
      componentProps: { 
        dateFormatted: this.endDateFormatted,
        date: this.end_date
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
 
      if (e.data && e.data.date) {
        this.endDateFormatted = e.data.dateFormatted;
        this.end_date = e.data.date;
      }
    });
    modal.present();
  }

  async selectStartDate(event) {
     
    window.history.pushState({ navigationId: window.history.state.navigationId }, "", window.location.pathname);

    const modal = await this.popoverCtrl.create({
      component: DatePickerComponent, 
      event: event,
      componentProps: { 
        dateFormatted: this.startDateFormatted,
        date: this.start_date
      }
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
 
      if (e.data && e.data.date) {
        this.startDateFormatted = e.data.dateFormatted;
        this.start_date = e.data.date;
      }
    });
    modal.present();
  }
}
