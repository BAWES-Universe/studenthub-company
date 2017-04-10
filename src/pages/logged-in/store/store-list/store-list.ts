import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController, NavParams } from 'ionic-angular';

import { StoreViewPage } from '../store-view/store-view';

// Providers
import { StoreService } from '../../../../providers/logged-in/store.service';
// Models
import { Store } from '../../../../models/store';

@Component({
  selector: 'page-store-list',
  templateUrl: 'store-list.html'
})
export class StoreListPage {

  public pageCount = 0;
  public currentPage = 1;
  public pages: number[] = [];

  public stores: Store[];

  constructor(
    public navCtrl: NavController,
    public storeService: StoreService,
    private _modalCtrl: ModalController,
    private _loadingCtrl: LoadingController,
    public params: NavParams,
  ) {
   
  }

  ionViewDidLoad() {
    this.loadData(this.currentPage);
  }

  loadData(page: number) {
    // Load list of store
    this.stores = [];
    let loader = this._loadingCtrl.create();
    loader.present();
    this.storeService.list(page).subscribe(response => {

      this.pageCount = response.headers.get('X-Pagination-Page-Count');
      this.currentPage = response.headers.get('X-Pagination-Current-Page');

      this.pages = [];

      for(var i = 1; i <= this.pageCount; i++){
         this.pages.push(i);
      }

      //hide if no page = 1 

      if(this.pageCount == 1)
        this.pages = [];

      for (let store of response.json()) {
          this.stores.push(store);
      }

      loader.dismiss();
    });
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

}
