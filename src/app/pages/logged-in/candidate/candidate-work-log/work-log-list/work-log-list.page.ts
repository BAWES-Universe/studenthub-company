import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController, PopoverController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
// models
import { Store } from '../../../../../models/store';
// services
import { StoreService } from '../../../../../providers/logged-in/store.service';
import { AwsService } from 'src/app/providers/aws.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
//components
import { SelectSearchPageComponent } from 'src/app/components/select-search/select-search-page/select-search-page.component';
import { CandidateOptionComponent } from '../../../store/store-list/candidate-option-component';
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';
import { WorkLogFilterPage } from '../work-log-filter/work-log-filter.page';


@Component({
  selector: 'app-work-log-list',
  templateUrl: './work-log-list.page.html',
  styleUrls: ['./work-log-list.page.scss'],
})
export class WorkLogListPage implements OnInit {

  public pageCount = 0;
  public currentPage = 1;
  public totalCount = 0;

  public candidates = [];

  public store: Store;
  public store_id;

  public loading: boolean = false;

  public borderLimit;
  
  public allStores: Store[];//without candidate details 

  public filters: {
    name: string,
    session_status: number,
    end_date: string,
    start_date: string
  } = {
    name: null,
    session_status: 0,
    end_date: null,
    start_date: null
  };

  public stats: any; 

  public segment: string = "logs";

  public interval;

  public generatingExcel: boolean = false; 
  public generatingApprovedExcel: boolean = false; 

  constructor(
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public activatedRoute: ActivatedRoute,
    public awsService: AwsService,
    public candidateService: CandidateService,
    public translateService: TranslateLabelService,
    public storeService: StoreService,
    public analyticService: AnalyticsService
  ) {
  }

  ngOnInit() {
    this.analyticService.page('Store View Page');
 
    this.loadData();
    this.loadAllStores();

    //this.loadSummary();
  }

  /*ionViewDidEnter() {
    this.interval = setInterval(() => {
      this.loadSummary();
    }, 1000);
  }*/

  ionViewWillLeave() {
    this.analyticService.track('page_exit', {
      'page': 'Store View Page'
    });  

    clearInterval(this.interval);
    this.interval = null;
  }

  doRefresh(event) {
    if (this.segment == "logs") {
      this.loadData();
    } else {
      this.loadSummary();
    }

    event.target.complete();
  }

  segmentChanged(event) {
    if (event.target.value == "logs" && this.candidates.length == 0) {
      this.loadData();
    }
  }

  loadSummary() {

    //this.loading = true;
 
    const urlParams = this.urlParams();

    this.candidateService.workLogStats(urlParams).subscribe(result => {
    //  this.loading = false;
 
      this.stats = result;
    }, () => {
     // this.loading = false;
    });
  }

  searchByName(event) {
    this.filters.name = event.detail.value;
    this.loadData(); // reload all result
  }

  download(approved = null) {
    if (approved) {
      this.generatingApprovedExcel = true;
    } else {
      this.generatingExcel = true;
    }

    let urlParams = this.urlParams();

    if (approved)
      urlParams += "&approved=" + approved;

    this.candidateService.downloadWorkLog(urlParams).subscribe(result => {
      if (approved) {
        this.generatingApprovedExcel = false;
      } else {
        this.generatingExcel = false;
      }
    });
  }

  async loadData() {
    
    this.loading = true;
 
    const urlParams = this.urlParams();

    this.candidateService.listWithPagination(1, urlParams).subscribe(result => {
      this.loading = false;

      this.pageCount = parseInt(result.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(result.headers.get('X-Pagination-Current-Page'));
      this.totalCount = parseInt(result.headers.get('X-Pagination-Total-Count'));
      
      this.candidates = result.body;
    }, () => {
      this.loading = false;
    });
  }

  /**
   * load more data on scroll to bottom
   * @param event
   */
  doInfinite(event) {

    this.loading = true;

    this.currentPage++;
 
    this.candidateService.listWithPagination(this.currentPage, this.urlParams()).subscribe(response => {

        this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
        this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
        this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));
        this.candidates = this.candidates.concat(response.body);
        event.target.complete();
    },
    error => { },
    () => {
      this.loading = false;
    });
  }

  /**
   * Load Detail Page
   */
  candidateSelected(model, event) {
    event.preventDefault();
    event.stopPropagation();

    this.navCtrl.navigateForward('candidate-view/' + model.candidate_id, {
      state: {
        model
      }
    });
  }
  
  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  onImageError(candidate) {
    candidate.candidate_personal_photo = null;
  }

  toggleOpen(candidate, event) {
    event.stopPropagation();
    event.preventDefault(); 
    candidate.isOpen = !candidate.isOpen;
  }
  
  preventDefault(event) {
    event.stopPropagation();
    event.preventDefault(); 
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

  /**
   * Loads the create page
   */
  async filter() {
    window.history.pushState({ navigationId: window.history.state?.navigationId }, null, window.location.pathname);

    const modal = await this.modalCtrl.create({
      component: WorkLogFilterPage,
      componentProps: {
        filters: Object.assign({}, this.filters),
      }
    });
    // Refresh List if required
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e && e.data && e.data.refresh) {
        this.filters = e.data.filter;
        this.currentPage = 1;
        this.loadData();
      }
    });
    modal.present();
  }

  /**
   * Reset question filter
   */
  resetFilter() {
    this.filters = {
      session_status: null,
      end_date: null, 
      start_date: null,
      name: this.filters.name
    };

    this.currentPage = 1;

    this.loadData(); // reload all result
  }

  /**
   * Return url string to filter list
   */
  urlParams() {
    let urlParams = 'expand=storeAssignmentRequest,latestCandidateWorkingDate,latestCandidateWorkingDate.health,totalCandidateWorkingDate&with_session=1';

    if (this.filters.start_date) {
      urlParams += '&start_date=' + this.filters.start_date;
    }
    
    if (this.filters.end_date) {
      urlParams += '&end_date=' + this.filters.end_date;
    }
    
    if ([0, 1, 2].indexOf(this.filters.session_status) > -1) {
      urlParams += '&session_status=' + this.filters.session_status;
    }

    if (this.filters.name) {
      urlParams += '&q=' + this.filters.name;
    }
    
    return urlParams;
  }
}
