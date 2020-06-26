import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from "@ionic/angular";
import { ActivatedRoute, Router } from "@angular/router";
//models
import { Company } from "src/app/models/company";
import { Store } from "src/app/models/store";
//services
import { StoreService } from "src/app/providers/logged-in/store.service";
import { CompanyService } from "src/app/providers/logged-in/company.service";


@Component({
  selector: 'app-company-view',
  templateUrl: './company-view.page.html',
  styleUrls: ['./company-view.page.scss'],
})
export class CompanyViewPage implements OnInit {

  public company_id = null;
  public company: Company;
  public stores: Store[];

  public pageCount = 0;
  public currentPage = 1;
  public pages: number[] = [];

  constructor(
    public navCtrl: NavController,
    public activatedRoute: ActivatedRoute,
    public storeService: StoreService,
    public companyService: CompanyService,
    private _loadingCtrl: LoadingController,
    public router: Router,
  ) {
    const state = window.history.state;
    this.company_id = this.activatedRoute.snapshot.paramMap.get('id');

    if (state['model']) {
      this.company = state['model'];
    }
  }

  ngOnInit() {
    this.loadData(this.currentPage);
    if (!this.company) {
      this.loadCompanyData();
    }
  }

  async loadData(page: number) {
    // Load list of ALL stores
    let loader = await this._loadingCtrl.create();
    loader.present();

    this.storeService.listByCompany(this.company_id, page).subscribe(response => {

      this.pageCount = response.headers.get('X-Pagination-Page-Count');
      this.currentPage = response.headers.get('X-Pagination-Current-Page');

      this.pages = [];

      for (var i = 1; i <= this.pageCount; i++) {
        this.pages.push(i);
      }

      //hide if no page = 1

      if (this.pageCount == 1)
        this.pages = [];

      this.stores = response.body;

      loader.dismiss();
    });
  }

  async loadCompanyData() {
    // Load list of ALL stores
    let loader = await this._loadingCtrl.create();
    loader.present();

    this.companyService.view(this.company_id).subscribe(response => {
      this.company = response;
      loader.dismiss();
    });
  }

  pageLinkColor(page: number) {

    if (page == this.currentPage)
      return 'light';

    return '';
  }

  storeSelected(model) {
    // Load Detail Page
    this.navCtrl.navigateForward('store-view/' + model.store_id, {
      state: {
        model: model
      }
    });
  }
}

