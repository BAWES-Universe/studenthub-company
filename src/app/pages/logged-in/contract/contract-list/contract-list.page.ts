import { Component, OnInit } from '@angular/core';
//models
import { Contract } from 'src/app/models/contract';
//services
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { ContractService } from 'src/app/providers/logged-in/contract.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';


@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.page.html',
  styleUrls: ['./contract-list.page.scss'],
})
export class ContractListPage implements OnInit {

  public query: string; 

  public pageCount = 0;
  public totalEmployees = 0;
  public currentPage = 1;
  public pages: number[] = [];

  public contracts: Contract[] = [];

  public loading = false;

  public borderLimit;

  constructor(
    public contractService: ContractService,
    public translateService: TranslateLabelService,
    public analyticService: AnalyticsService
  ) {
  }

  ngOnInit() {
    this.analyticService.page('Contract List Page');
  }

  ionViewWillLeave() {
    this.analyticService.track('page_exit', {
      'page': 'Contract List Page'
    });
  }

  ionViewWillEnter() {
    this.loadData(1);
  }

  /**
   * Load contract Data
   */
  async loadData(page: number) {
    // Load list of contract

    if (this.contracts.length == 0)
      this.loading = true;

    this.contractService.list(this.query, page).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));

      this.contracts = response.body;
    },
      error => { },
      () => { this.loading = false; }
    );
  }

  /**
   * Method perform infinite scroll which
   * will load more data just like pagination
   */
  doInfinite(infiniteScroll) {

    this.currentPage++;

    this.loading = true;

    this.contractService.list(this.query, this.currentPage).subscribe(response => {
      this.loading = false;
      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.contracts = this.contracts.concat(response.body);

    },
      error => { },
      () => {
        infiniteScroll.target.complete();
      });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
