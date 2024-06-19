import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, PopoverController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
// models
import { Store } from '../../../../models/store';
// services
import { StoreService } from '../../../../providers/logged-in/store.service';
import { AwsService } from 'src/app/providers/aws.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
//components
import { SelectSearchPageComponent } from 'src/app/components/select-search/select-search-page/select-search-page.component';
import { CandidateOptionComponent } from '../store-list/candidate-option-component';
import { CandidateService } from 'src/app/providers/logged-in/candidate.service';


@Component({
  selector: 'app-store-view',
  templateUrl: './store-view.page.html',
  styleUrls: ['./store-view.page.scss'],
})
export class StoreViewPage implements OnInit {

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
    name: string
  } = {
      name: null,
    };

  constructor(
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
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

    this.store_id = this.activatedRoute.snapshot.paramMap.get('id');

    const state = window.history.state;

    if (state.model) {
      this.store = state.model;
    } else {
      this.loadStore();
    }

    this.loadData();
    this.loadAllStores();
  }

  ionViewWillLeave() {
    this.analyticService.track('page_exit', {
      'page': 'Store View Page'
    });  
  }

  searchByName(event) {
    this.filters.name = event.detail.value;
    this.loadData(); // reload all result
  }

  async loadStore() {

    this.loading = true;
 
    this.storeService.view(this.store_id).subscribe(result => {
      this.loading = false;

      if (!result) {
        this.navCtrl.back();
      }

      this.store = result;
    }, () => {
      this.loading = false;
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
  candidateSelected(model) {
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
   * Return url string to filter list
   */
  urlParams() {
    let urlParams = 'expand=candidates,candidates.storeAssignmentRequest&store_id=' + this.store_id;

    if (this.filters.name) {
      urlParams += '&q=' + this.filters.name;
    }
    
    return urlParams;
  }
}

