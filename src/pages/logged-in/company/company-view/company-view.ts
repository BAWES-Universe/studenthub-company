import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, AlertController } from 'ionic-angular';

import { StoreService } from '../../../../providers/logged-in/store.service';

import { StoreViewPage } from '../../store/store-view/store-view';

// Models
import { Company } from '../../../../models/company';
import { Store } from '../../../../models/store';

@Component({
  selector: 'page-company-view',
  templateUrl: 'company-view.html'
})
export class CompanyViewPage {

  public company: Company;
  public stores: Store[];

  public pageCount = 0;
  public currentPage = 1;
  public pages: number[] = [];

  constructor(
    public navCtrl: NavController,
    private _modalCtrl: ModalController,
    params: NavParams,
    public storeService: StoreService,
    public alertCtrl: AlertController,
    private _loadingCtrl: LoadingController,
  ) {
    // console.log(params);
    this.company = params.get('model');
  }

  ionViewDidLoad() {
    this.loadData(this.currentPage);
  }

  loadData(page: number) {
     // Load list of ALL stores
     let loader = this._loadingCtrl.create();
     loader.present();

     this.storeService.listByCompany(this.company, page).subscribe(response => {

        this.pageCount = response.headers.get('X-Pagination-Page-Count');
        this.currentPage = response.headers.get('X-Pagination-Current-Page');

        this.pages = [];

        for(var i = 1; i <= this.pageCount; i++){
           this.pages.push(i);
        }

        //hide if no page = 1 

        if(this.pageCount == 1)
          this.pages = [];

        console.log(this.pages);

        this.stores = response.json();     

        loader.dismiss();
     });
  }

  pageLinkColor(page: number) {

    if(page == this.currentPage) 
      return 'light';
    
    return '';
  }

  storeSelected(model) {
    // Load Detail Page
    this.navCtrl.push(StoreViewPage, {
      'model': model
    });
  }    
}
