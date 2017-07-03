import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController, AlertController } from 'ionic-angular';

//Pages
import { TransferFormPage } from '../transfer-form/transfer-form';
import { TransferViewPage } from '../transfer-view/transfer-view';

// Providers
import { TransferService } from '../../../../providers/logged-in/transfer.service';

// Models
import { Transfer } from '../../../../models/transfer';

@Component({
  selector: 'page-transfer-list',
  templateUrl: 'transfer-list.html'
})
export class TransferListPage {
  inProgress: string = "In Progress";
  public pageCount = 0;
  public currentPage = 1;
  public pages: number[] = [];

  public transfers: Transfer[];  

  public completedTransfers: Transfer[] = [];
  public receivedTransfers: Transfer[] = [];
  public inProgressTransfers: Transfer[] = [];
  public draftTransfers: Transfer[] = [];
  public sentTransfers: Transfer[] = [];
  public lockTransfers: Transfer[] = [];

  constructor(
    public navCtrl: NavController,
    public transferService: TransferService,
    private _modalCtrl: ModalController,
    private _loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ionViewDidLoad() {
    // this.loadData();   
  }
  
  ionViewWillEnter() {
    this.loadData(this.currentPage);
  }

  /**
   * Load Transfer Data
   */
  loadData(page: number) {
    // Load list of transfer
    let loader = this._loadingCtrl.create();
    loader.present();
    this.transferService.list(page).subscribe(response => {

      this.pageCount = response.headers.get('X-Pagination-Page-Count');
      this.currentPage = response.headers.get('X-Pagination-Current-Page');

      this.pages = [];

      for(var i = 1; i <= this.pageCount; i++){
         this.pages.push(i);
      }

      //hide if page = 1 
      if(this.pageCount == 1)
        this.pages = [];

      this.transfers = response.json();
      this.organiseTransfers();
      
      },
    error => {},
    () => {loader.dismiss();}
    );
  }

  /**
   * Organise the transfers into groups based on transfer status
   */
  organiseTransfers(){
    // Clear existing transfer arrays 
    this.draftTransfers = [];
    this.lockTransfers = [];
    this.receivedTransfers = [];
    this.sentTransfers = [];
    this.inProgressTransfers = [];
    this.completedTransfers = [];

    // Loop through entire transfer list and update
    for (let transfer of this.transfers) {
      switch(transfer.transfer_status){
        case this.transferService.STATUS_INITIATED:
          this.draftTransfers.push(transfer);
          break;
        case this.transferService.STATUS_LOCK:
          this.lockTransfers.push(transfer);
          break;
        case this.transferService.STATUS_PAYMENT_RECEIVED:
          this.receivedTransfers.push(transfer);
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
  }

  /**
   * Renders the color based on page number
   */
  pageLinkColor(page: number) {
    if(page == this.currentPage) 
      return 'light';
    
    return '';
  }

  /**
   * Loads form to initiate a new transfer
   */
  createNewTransfer() {
    this.navCtrl.push(TransferFormPage, {
      model: new Transfer()
    });
  }

  /**
   * Display Transfers Detail Page for transfer_id
   */
  transferDetails(transfer_id: number) {
    this.navCtrl.push(TransferViewPage, {
      'model': transfer_id
    });
  }
}
