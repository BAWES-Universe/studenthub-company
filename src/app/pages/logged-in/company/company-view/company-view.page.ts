import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
// models
import { Company } from 'src/app/models/company';
import { Store } from 'src/app/models/store';
// services
import { StoreService } from 'src/app/providers/logged-in/store.service';
import { CompanyService } from 'src/app/providers/logged-in/company.service';


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
  public loading = false;

  public borderLimit;
  
  constructor(
    public navCtrl: NavController,
    public activatedRoute: ActivatedRoute,
    public storeService: StoreService,
    public companyService: CompanyService,
    public router: Router,
  ) {
  }

  ngOnInit() {
    window.analytics.page('Company View Page');

    const state = window.history.state;
    this.company_id = this.activatedRoute.snapshot.paramMap.get('id');

    if (state.model) {
      this.company = state.model;
    }
    
    this.loadData(this.currentPage);

    if (!this.company) {
      this.loadCompanyData();
    }
  }

  /**
   * Load list of ALL stores
   * @param page 
   */
  async loadData(page: number) {
   
    this.loading = true;

    this.storeService.listByCompany(this.company_id, page).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.pages = [];

      for (let i = 1; i <= this.pageCount; i++) {
        this.pages.push(i);
      }

      // hide if no page = 1

      if (this.pageCount == 1) {
        this.pages = [];
      }

      this.stores = response.body;

      this.loading = false;
    });
  }

  async loadCompanyData() {
    // Load list of ALL stores
    this.loading = true;

    this.companyService.view(this.company_id).subscribe(response => {
      if (!response){
        this.navCtrl.back();
      }
      this.company = response;
      this.loading = false;
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  pageLinkColor(page: number) {

    if (page == this.currentPage) {
      return 'light';
    }

    return '';
  }

  storeSelected(model) {
    // Load Detail Page
    if (model && model.candidates && !model.candidates.length) {
      return false;
    }

    this.navCtrl.navigateForward('store-view/' + model.store_id, {
      state: {
        model
      }
    });
  }
}

