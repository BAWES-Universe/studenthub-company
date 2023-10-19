import { Component, OnInit } from '@angular/core';
import { ActionSheetController, NavController } from '@ionic/angular';
// models
import { Transfer } from 'src/app/models/transfer';
// services
import { TransferService } from 'src/app/providers/logged-in/transfer.service';
import {CandidateService} from '../../../../providers/logged-in/candidate.service';
import {EventService} from '../../../../providers/event.service';
import {TranslateService} from "@ngx-translate/core";
import {TranslateLabelService} from "../../../../providers/translate-label.service";
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-transfer-list',
  templateUrl: './transfer-list.page.html',
  styleUrls: ['./transfer-list.page.scss'],
})
export class TransferListPage implements OnInit {

  public inProgress = 'In Progress';

  public totalInProcess: number = 0;

  public pageCount = 0;
  public totalEmployees = 0;
  public currentPage = 1;
  public pages: number[] = [];

  public transfers: Transfer[] = [];

  public completedTransfers: Transfer[] = [];
  public receivedTransfers: Transfer[] = [];
  public inProgressTransfers: Transfer[] = [];
  public draftTransfers: Transfer[] = [];
  public sentTransfers: Transfer[] = [];
  public lockTransfers: Transfer[] = [];

  public loading = false;

  public borderLimit;

  constructor(
    public navCtrl: NavController,
    public transferService: TransferService,
    private actionSheetCtrl: ActionSheetController,
    private candidateService: CandidateService,
    private eventService: EventService,
    private translateService: TranslateLabelService,
    public analyticService: AnalyticsService
  ) {
    this.eventService.companyChanged$.subscribe(() => {
      this.loadTotalEmployee();
      this.loadData(1);
    });
  }

  ngOnInit() {
    this.analyticService.page('Transfer List Page');

    // this.loadData(this.currentPage);
    this.loadTotalEmployee();
  }

  ionViewWillEnter() {
   this.loadData(1);
  }

  /**
   * Load Transfer Data
   */
  async loadData(page: number) {
    // Load list of transfer

    if(this.transfers.length == 0)
      this.loading = true;

    this.transferService.list(page).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));

      this.transfers = response.body;
      this.organiseTransfers();

    },
      error => { },
      () => { this.loading = false; }
    );
  }

  /*
 * Method perform infinite scroll which
 * will load more data just like pagination
 */
  doInfinite(infiniteScroll) {

    this.currentPage++;

    this.loading = true;

    this.transferService.list(this.currentPage).subscribe(response => {
      this.loading = false;
      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.transfers = this.transfers.concat(response.body);
      this.organiseTransfers();

    },
    error => { },
    () => {
      infiniteScroll.target.complete();
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  /**
   * Organise the transfers into groups based on transfer status
   */
  organiseTransfers() {
    // Clear existing transfer arrays
    this.draftTransfers = [];
    this.lockTransfers = [];
    this.receivedTransfers = [];
    this.sentTransfers = [];
    this.inProgressTransfers = [];
    this.completedTransfers = [];

    // Loop through entire transfer list and update
    for (const transfer of this.transfers) {
      switch (transfer.transfer_status) {
        
        case this.transferService.STATUS_INITIATED:
          this.draftTransfers.push(transfer);
          break;
        case this.transferService.STATUS_LOCK:
          this.lockTransfers.push(transfer);
          break;
        case this.transferService.STATUS_PAYMENT_SENT:
          this.sentTransfers.push(transfer);
          break;
        case this.transferService.STATUS_SALARY_DISTRIBUTION_IN_PROGRESS:
          this.inProgressTransfers.push(transfer);
          break;
        case this.transferService.STATUS_TRANSFER_COMPLETE:
          this.completedTransfers.push(transfer);
          break;
      }
    }

    this.getTotalPendingTransfers();
  }

  /**
   * Loads form to initiate a new transfer
   */
  createNewTransfer() {
    this.navCtrl.navigateForward('transfer-form');
  }

  /**
   * Loads form to initiate a new transfer
   */
  importTransfer() {
    this.navCtrl.navigateForward('import-transfer-form');
  }

  /**
   * Display Transfers Detail Page for transfer_id
   */
  transferDetails(transfer_id: number) {
    this.navCtrl.navigateForward('transfer-view/' + transfer_id);
  }

  /**
   * Present action sheet to create a new transfer
   */
  async presentActionSheetForNewTransfer() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: this.translateService.transform('How do you wish to create your transfer?'),
      buttons: [
        {
          text: this.translateService.transform('Manual input of hours'),
          handler: () => {
            this.createNewTransfer();
          }
        },
        {
          text: this.translateService.transform('Excel sheet upload'),
          handler: () => {
            this.importTransfer();
          }
        }
      ]
    });

    actionSheet.present();
  }

  loadTotalEmployee() {
    this.candidateService.total().subscribe(result => {
      this.totalEmployees = result;
      this.eventService.totalEmployee$.next(result);
    });
  }

  public getTotalPendingTransfers() {
    const total =  (this.lockTransfers.length) + (this.draftTransfers.length) + (this.inProgressTransfers.length) + (this.sentTransfers.length);

    this.totalInProcess = total;

    if (!total) {
      this.inProgress = 'completed';
    }

    return total;
  }
}
