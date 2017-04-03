import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, AlertController } from 'ionic-angular';

//Pages
import { TransferFormPage } from '../../../../pages/logged-in/transfer/transfer-form/transfer-form';

// Providers
import { TransferService } from '../../../../providers/logged-in/transfer.service';
import { CandidateService } from '../../../../providers/logged-in/candidate.service';

// Models
import { TransferDetails, TransferListModel, InvoiceModel } from '../../../../models/transfer';
import { Candidate } from '../../../../models/candidate';

@Component({
  selector: 'page-transfer-view',
  templateUrl: 'transfer-view.html'
})
export class TransferViewPage {
  public transferDetails: TransferDetails[];
  public transferData: TransferListModel[];

  public invoiceDetails: InvoiceModel[];

  public transfer_id: number;
  public candidate: Candidate[];
  public transferStatus: any;

  constructor(
    public navCtrl: NavController,
    public transferService: TransferService,
    public candidateService: CandidateService,
    private _modalCtrl: ModalController,
    private _loadingCtrl: LoadingController,
    public params: NavParams,
    public alertCtrl: AlertController
  ) {

    this.transfer_id = params.get('model');
    this.transferData = params.get('transferData');
    this.transferStatus = params.get('status');


  }

  ionViewDidLoad() {
    this.loadData();
  }


  loadData() {
    // Load list of transfer
    let loader = this._loadingCtrl.create();
    loader.present();
    this.transferService.transferIdDetails(this.transfer_id).subscribe(response => {
      //this.transferDetails = response;
      // this.candidate = response.candidates;
      this.invoiceDetails = response;
      loader.dismiss();
    });
  }

  /**
  * Transfer Locking  */
  transferLock(invoice_id: number) {
    // Load list of transfer
    let loader = this._loadingCtrl.create();
    loader.present();
    this.transferService.makeTransfertoLock(invoice_id).subscribe(response => {
      this.navCtrl.pop();
      loader.dismiss();
    });
  }

  /**
 * Marking Invoice as Payment Sent  */
  paymentSent(invoice_id: number) {
    let loader = this._loadingCtrl.create();
    loader.present();
    this.transferService.makePaymentSent(invoice_id).subscribe(response => {
      this.navCtrl.pop();
      loader.dismiss();
    });
  }

  /**
* Generate  Invoice   */
  generateInvoice(invoice_id: number) {
    let loader = this._loadingCtrl.create();
    loader.present();
    this.transferService.generateInvoiceCopy(invoice_id).subscribe(response => {
      this.navCtrl.pop();
      loader.dismiss();
    });
  }



  // Calculating Total cost     
  totalCost(hourly_rate, hours, bonus, transfer_cost) {
    return (2 * (Number(hours) + Number(bonus)) - Number(transfer_cost));
  }


  edit(invoiceDetails: any) {
    // Transfers  Detail Page
    this.navCtrl.push(TransferFormPage, {
      'invoiceModel': invoiceDetails,
      'editModel': true
    });
  }

}

