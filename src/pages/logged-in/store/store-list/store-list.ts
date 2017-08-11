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
    this.loadData(this.currentPage);
  }

  loadData(page: number) {
    // Load list of store
    this.stores = [];
    let loader = this._loadingCtrl.create();
    loader.present();
    this.storeService.listByCompanyStore(page).subscribe(response => {
        this.title = response.type;
      if (response.type == 'Company') {
        this.companies = response.results;
      } else {
        this.stores = response.results;
      }
    },
    error => {},
    () => {loader.dismiss();}
    );
  }

  pageLinkColor(page: number) {

    if(page == this.currentPage) 
      return 'light';
    
    return '';
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
