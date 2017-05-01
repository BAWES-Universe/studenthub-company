import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, AlertController } from 'ionic-angular';

//Pages
import { TransferFormPage } from '../../../../pages/logged-in/transfer/transfer-form/transfer-form';

// Providers
import { TransferService } from '../../../../providers/logged-in/transfer.service';

// Models
import { Transfer, Invoice } from '../../../../models/transfer';

@Component({
  selector: 'page-transfer-view',
  templateUrl: 'transfer-view.html'
})
export class TransferViewPage {

  public transfer_id: number;
  public transferDetails: Transfer[];
  public invoices: Invoice[] = []; //unpaid invoices 
  public receipts: Invoice[] = []; //paid invoices 

  constructor(
    public navCtrl: NavController,
    public transferService: TransferService,
    private _modalCtrl: ModalController,
    private _loadingCtrl: LoadingController,
    public params: NavParams,
    public alertCtrl: AlertController
  ) {

    this.transfer_id = params.get('model');
  }

  ionViewDidLoad() {
    this.loadData();
  }


  loadData() {
    // Load list of transfer
    let loader = this._loadingCtrl.create();
    loader.present();
    this.transferService.transferIdDetails(this.transfer_id).subscribe(response => {
      this.transferDetails = response;

      response.invoices.forEach((value, index) => {
        if(value.invoice_status == 'paid') {
          this.receipts.push(value);
        }else{
          this.invoices.push(value);
        }
      });

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
   * Donwload Receipt
   */
  downloadReceipt(invoice_id: number) {
    let loader = this._loadingCtrl.create();
    loader.present();
    this.transferService.downloadReceipt(invoice_id).subscribe(response => {
      //this.navCtrl.pop();
      loader.dismiss();
    });
  }

  /** 
   * Donwload invoice
   */
  downloadInvoice(invoice_id: number) {
    let loader = this._loadingCtrl.create();
    loader.present();
    this.transferService.downloadInvoice(invoice_id).subscribe(response => {
      //this.navCtrl.pop();
      loader.dismiss();
    });
  }

  edit(transferDetails: any) {
    // Transfers  Detail Page
    this.navCtrl.push(TransferFormPage, {
      'model': transferDetails,
      'editModel': true
    });
  }

  /**
   * Calculating Total per Candidate
   */     
  total(candidate) {
    return (Number(candidate.company_hourly_rate) * Number(candidate.hours)) + Number(candidate.bonus);
  }
}

