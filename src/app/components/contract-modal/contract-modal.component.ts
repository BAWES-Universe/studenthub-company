import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
//models
import { Contract } from 'src/app/models/contract';
//services
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { ContractService } from 'src/app/providers/logged-in/contract.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';


@Component({
  selector: 'app-contract-modal',
  templateUrl: './contract-modal.component.html',
  styleUrls: ['./contract-modal.component.scss'],
})
export class ContractModalComponent implements OnInit {

  public query: string; 

  public pageCount = 0;
  public totalEmployees = 0;
  public currentPage = 1;
  public pages: number[] = [];

  public contracts: Contract[] = [];

  public loading = false;

  public borderLimit;

  constructor(
    public modalCtrl: ModalController,
    public contractService: ContractService,
    public translateService: TranslateLabelService,
    public analyticService: AnalyticsService
  ) {
  }

  ngOnInit() {
    this.analyticService.page('Contract Selection Page');
  }

  ionViewWillLeave() {
    this.analyticService.track('page_exit', {
      'page': 'Contract Selection Page'
    });
  }

  ionViewWillEnter() {
    this.loadData(1);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  contractDetails(contract) {
    this.modalCtrl.dismiss({
      contract: contract
    })
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
