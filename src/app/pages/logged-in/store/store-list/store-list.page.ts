import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, PopoverController, ToastController } from '@ionic/angular';
import { CandidateOptionComponent } from './candidate-option-component';
// models
import { Store } from 'src/app/models/store';
import { Company } from 'src/app/models/company';
// service
import { StoreService } from 'src/app/providers/logged-in/store.service';
import { AwsService } from 'src/app/providers/aws.service';
import {TranslateLabelService} from "../../../../providers/translate-label.service";
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { SelectSearchPageComponent } from 'src/app/components/select-search/select-search-page/select-search-page.component';


@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.page.html',
  styleUrls: ['./store-list.page.scss'],
})
export class StoreListPage implements OnInit {

  public pageCount = 0;
  public currentPage = 1;
  public pages: number[] = [];

  public stores: Store[];
  public companies: Company[];
  public loading = false;

  public allStores: Store[];//without candidate details 
  public borderLimit;

  constructor(
    public toastCtrl: ToastController,
    public popoverCtrl: PopoverController,
    public navCtrl: NavController,
    public storeService: StoreService,
    public aws: AwsService,
    public alertCtrl: AlertController,
    public translateService: TranslateLabelService,
    public analyticService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticService.page('Store List Page');

    this.loadData();

    this.storeService.listByCompanyStore(-1, "").subscribe(response => {
      this.allStores = response.body;
    });
  }

  ionViewWillLeave() {
    this.analyticService.track('page_exit', {
      'page': 'Store List Page'
    });  
  }
  
  async loadData() {

    this.stores = [];
    this.companies = [];

    this.loading = true;
    this.storeService.listByCompanyStore(1).subscribe(response => {
        this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
        this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
        this.stores = response.body;
    },
      error => this.loading = false,
      () => this.loading = false
    );
  }

  /*
  * Method perform infinite scroll which
  * will load more data just like pagination
  */
  doInfinite(infiniteScroll) {
    this.currentPage++;
    this.storeService.listByCompanyStore(this.currentPage).subscribe(response => {
      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.stores = this.stores.concat(response.body);
    },
      error => { },
      () => {
        infiniteScroll.target.complete();
      });
  }

  candidateSelected(model) {
    // Load Detail Page
    this.navCtrl.navigateForward('candidate-view/' + model.candidate_id , {
      state : {
        model
      }
    });
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

  /**
   * open popup to select store
   * @param ev
   */
  async assingToStore(candidate) {

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

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 0);
  }

  onImageError(candidate) {
    candidate.candidate_personal_photo = null;
  }
}
