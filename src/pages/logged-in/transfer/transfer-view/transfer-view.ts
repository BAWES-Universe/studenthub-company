import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, AlertController } from 'ionic-angular';

//Pages
import { TransferFormPage } from '../../../../pages/logged-in/transfer/transfer-form/transfer-form';

// Providers
import { TransferService } from '../../../../providers/logged-in/transfer.service';

// Models
import { Transfer } from '../../../../models/transfer';
import { Invoice } from '../../../../models/invoice';

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

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    // Load list of transfer
    let loader = this._loadingCtrl.create();
    loader.present();
    this.transferService.transferIdDetails(this.transfer_id).subscribe(response => {
      this.transferDetails = response;
      
      this.receipts = [];
      this.invoices = [];
      
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
   * Transfer Locking  
   */
  transferLock(invoice_id: number) {
    // Load list of transfer
    let alert = this.alertCtrl.create({
      title: 'Confirm Locking Transfer',
      message: "By locking the transfer, you'll be generating the final payment invoices for this transfer, are you sure?",
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            let loader = this._loadingCtrl.create();
            loader.present();
            this.transferService.makeTransfertoLock(invoice_id).subscribe(response => {
              this.navCtrl.pop();
              loader.dismiss();
            });
          }
        }
      ]
    });
    alert.present();  
  }

  /**
   * Marking Invoice as Payment Sent  
   */
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

  /**
   * Calculating Total cost
   */     
  totalCost(hourly_rate, hours, bonus, transfer_cost) {
    return (2 * Number(hours)) + Number(bonus) + Number(transfer_cost);
  }

  /**
   * Load the Transfer form page to edit the transfer details
   */
  edit(transferDetails: any) {
    this.navCtrl.push(TransferFormPage, {
      'model': transferDetails,
      'editModel': true
    });
  }

  
  delete(transfer_id: number) {

    let alert = this.alertCtrl.create({
    title: 'Confirm delete',
    message: 'Do you really want to delete this transfer?',
    buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.deleteConfirmed(transfer_id);
          }
        }
      ]
    });
    alert.present();
  }

  deleteConfirmed(transfer_id) {
    let loader = this._loadingCtrl.create();
    loader.present();
    this.transferService.delete(transfer_id).subscribe(response => {
      loader.dismiss();
      
      if(response.operation == 'success'){
        this.navCtrl.pop();
      }else{
        let alert = this.alertCtrl.create({
            message: response.message,
            buttons: ['Okay']
          });
          alert.present();
      }
    });
  }

  /**
   * Calculating Total per Candidate
   */     
  total(candidate) {
    return (Number(candidate.company_hourly_rate) * Number(candidate.hours)) + Number(candidate.bonus);
  }
}

