import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController, AlertController } from 'ionic-angular';

//Pages
import { TransferFormPage } from '../transfer-form/transfer-form';
import { TransferViewPage } from '../transfer-view/transfer-view';

// Providers
import { TransferService } from '../../../../providers/logged-in/transfer.service';
import { CandidateService } from '../../../../providers/logged-in/candidate.service';

// Models
import { Transfer } from '../../../../models/transfer';

@Component({
  selector: 'page-transfer-list',
  templateUrl: 'transfer-list.html'
})
export class TransferListPage {
  draft: string = "drafts";
  public pageCount = 0;
  public currentPage = 1;
  public pages: number[] = [];

  public transfers: Transfer[];  

  constructor(
    public navCtrl: NavController,
    public transferService: TransferService,
    public candidateService: CandidateService,
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

      //hide if no page = 1 

      if(this.pageCount == 1)
        this.pages = [];

      this.transfers = response.json();
      
      },
    error => {},
    () => {loader.dismiss();}
    );
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
    this.candidateService.listAll().subscribe(response => {

      //console.log(response);
      this.navCtrl.push(TransferFormPage, {
        model: new Transfer(),
        candidates: response,
        editModel: false
      });
    });
  }

  //Transfers details for each transfer_id
  transferDetails(transfer_id: number) {
    // Transfers  Detail Page
    this.navCtrl.push(TransferViewPage, {
      'model': transfer_id
    });
  }
}
