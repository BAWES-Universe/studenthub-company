import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController, NavParams } from 'ionic-angular';

import { CompanyViewPage } from '../company-view/company-view';

// Providers
import { CompanyService } from '../../../../providers/logged-in/company.service';

// Models
import { Company } from '../../../../models/company';

@Component({
  selector: 'page-company-list',
  templateUrl: 'company-list.html'
})
export class CompanyListPage {

  public pageCount = 0;
  public currentPage = 1;
  public pages: number[] = [];

  public companies: Company[];

  constructor(
    public navCtrl: NavController,
    public companyService: CompanyService,
    private _modalCtrl: ModalController,
    private _loadingCtrl: LoadingController,
    public params: NavParams,
  ) {
    
  }

  ionViewDidLoad() {
    this.loadData(this.currentPage);
  }

  loadData(page: number) {

    this.companies = [];
    let loader = this._loadingCtrl.create();
    loader.present();
    this.companyService.list(page).subscribe(response => {

      this.pageCount = response.headers.get('X-Pagination-Page-Count');
      this.currentPage = response.headers.get('X-Pagination-Current-Page');

      this.pages = [];

      for(var i = 1; i <= this.pageCount; i++){
         this.pages.push(i);
      }

      //hide if no page = 1 

      if(this.pageCount == 1)
        this.pages = [];

      this.companies = response.json();

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
    this.navCtrl.push(CompanyViewPage, {
      'model': model
    });
  }

}
