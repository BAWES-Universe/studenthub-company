import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

//page
import { StoreViewPage } from '../store-view/store-view';
import { CompanyViewPage } from '../../company/company-view/company-view';

// Providers
import { StoreService } from '../../../../providers/logged-in/store.service';

// Models
import { Store } from '../../../../models/store';
import { Company } from '../../../../models/company';

@Component({
  selector: 'page-store-list',
  templateUrl: 'store-list.html'
})
export class StoreListPage {

  public pageCount = 0;
  public currentPage = 1;
  public pages: number[] = [];

  public stores: Store[];
  public companies: Company[];
  public title: string; 

  constructor(
    public navCtrl: NavController,
    public storeService: StoreService,
    private _loadingCtrl: LoadingController
  ) {}

  ionViewDidLoad() {
    this.loadData();
  }

  loadData() {
  
    this.stores = [];
    this.companies = [];
      
    let loader = this._loadingCtrl.create();
    loader.present();
    this.storeService.listByCompanyStore(1).subscribe(response => {
        this._handleResponse(response);
    },
    error => {},
    () => {loader.dismiss();}
    );
  }

  /*
  * Method perform infinite scroll which 
  * will load more data just like pagination
  */
  doInfinite(infiniteScroll) {
    this.currentPage ++;
    this.storeService.listByCompanyStore(this.currentPage).subscribe(response => {
      this._handleResponse(response);
    },
    error => {},
    () => {
      infiniteScroll.complete();    
    });    
  }
 
  _handleResponse(response)
  {
    if (response && response[0].company_name) {
      this.title = 'Companies';

      for(let item of response) {
        this.companies.push(item);
      }
    } 
  
    if (response && response[0].store_name) {
      this.title = 'Stores';

      for(let item of response) {
        this.stores.push(item);
      }
    }
  }
  
  rowSelected(model) {
    
    // Load Detail Page
    this.navCtrl.push(StoreViewPage, {
      'model': model
    });
  }

  companySelected(model) {
    // Load Detail Page
    this.navCtrl.push(CompanyViewPage, {
      'model': model
    });
  }
}
