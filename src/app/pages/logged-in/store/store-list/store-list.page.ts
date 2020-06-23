import { Component, OnInit } from '@angular/core';
import {LoadingController, NavController} from "@ionic/angular";
//models
import {Store} from "src/app/models/store";
import {Company} from "src/app/models/company";
//service
import {StoreService} from "src/app/providers/logged-in/store.service";

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
  public title: string;

  constructor(
      public navCtrl: NavController,
      public storeService: StoreService,
      private _loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.loadData();
  }

  async loadData() {

    this.stores = [];
    this.companies = [];

    let loader = await this._loadingCtrl.create();
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
    this.navCtrl.navigateForward('store-view/'+model.store_id);
    // this.navCtrl.push(StoreViewPage, {
    //   'model': model
    // });
  }

  companySelected(model) {
    // Load Detail Page
    this.navCtrl.navigateForward('company-view/'+model.company_id);
    // this.navCtrl.push(CompanyViewPage, {
    //   'model': model
    // });
  }
}
