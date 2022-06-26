import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
// models
import { Store } from 'src/app/models/store';
import { Company } from 'src/app/models/company';
// service
import { StoreService } from 'src/app/providers/logged-in/store.service';
import { AwsService } from 'src/app/providers/aws.service';
import {TranslateLabelService} from "../../../../providers/translate-label.service";


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

  public borderLimit;

  constructor(
    public navCtrl: NavController,
    public storeService: StoreService,
    public aws: AwsService,
    public translateService: TranslateLabelService,
  ) { }

  ngOnInit() {
    window.analytics.page('Store List Page');

    this.loadData();
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

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 0);
  }

  onImageError(candidate) {
    candidate.candidate_personal_photo = null;
  }
}
