import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, AlertController,ToastController } from 'ionic-angular';

//Pages
import { TransferFormPage } from '../../../../pages/logged-in/transfer/transfer-form/transfer-form';
import { CandidateViewPage } from '../../../../pages/logged-in/candidate/candidate-view/candidate-view';

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
  public transferDetails: Transfer;
  public invoices: Invoice[] = []; //unpaid invoices 
  public receipts: Invoice[] = []; //paid invoices 

  public transferStatus = "";
  public transferStatusDescription = "";

  constructor(
    public navCtrl: NavController,
    public transferService: TransferService,
    private _modalCtrl: ModalController,
    private _loadingCtrl: LoadingController,
    public params: NavParams,
    public alertCtrl: AlertController,
    public _toastCtrl:ToastController
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
      this._updateTransferStatus();

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
   * Update transfer status and description based on return value from API
   */
  private _updateTransferStatus(){
    switch(this.transferDetails.transfer_status){
      case 10: // Draft
        this.transferStatus = "Transfer Draft";
        this.transferStatusDescription = "'Lock Transfer' once you are done inputting hours worked by your assigned employees. Invoices will be sent to you after lock.";
        break;
      case 5: // Transfer Locked
        this.transferStatus = "Waiting for your payment";
        this.transferStatusDescription = "Please find your invoices below.";
        break;
      case 1: // Payment Sent
        this.transferStatus = "Payment Sent";
        this.transferStatusDescription = "Waiting for bank to verify payment received to start distribution of payment.";
        break;
      case 3: // Distribution in Progress
        this.transferStatus = "Distribution in Progress";
        this.transferStatusDescription = "Your payment has been received and is currently being distributed to your assigned employees.";
        break;
      case 4: // Transfer Complete
        this.transferStatus = "Transfer Complete";
        this.transferStatusDescription = "All done!";
        break;
    }
  }

  /**
   * Transfer Locking  
   */
  transferLock(transfer_id: number) {
    // Load list of transfer
    let alert = this.alertCtrl.create({
      title: 'Confirm locking the transfer?',
      message: "You will no longer be able to edit the transfer once it's locked.",
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
            this.transferService.makeTransfertoLock(transfer_id).subscribe(response => {
              
              let toast = this._toastCtrl.create({
                message: response.message,
                duration: 3000
              });
              toast.present();
              
              this.loadData();
              loader.dismiss();
            });
          }
        }
      ]
    });
    alert.present();  
  }

  /**
   * Marking Transfer as Payment Sent  
   */
  paymentSent(transfer_id: number) {
    let loader = this._loadingCtrl.create();
    loader.present();
    this.transferService.makePaymentSent(transfer_id).subscribe(response => {
      
      let toast = this._toastCtrl.create({
        message: response.message,
        duration: 3000
      });
      toast.present();

      this.loadData();
      loader.dismiss();
    });
  }

  /**
   * Download the receipt as specified by invoice_id
   * @param invoice_id 
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
   * Download the invoice as specified by invoice_id
   * @param invoice_id 
   */
  downloadInvoice(invoice_id: number) {
    let loader = this._loadingCtrl.create();
    loader.present();
    this.transferService.downloadInvoice(invoice_id).subscribe(response => {
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
      'model': transferDetails
    });
  }

  
  /**
   * Delete the transfer
   * @param transfer_id 
   */
  delete(transfer_id: number) {
    let alert = this.alertCtrl.create({
    title: 'Do you really want to delete this transfer?',
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

  /**
   * Confirm deletion of the transfer
   * @param transfer_id 
   */
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
   * On Candidate Selected
   * @param model 
   */
  loadCandidateDetail(model) {
    this.navCtrl.push(CandidateViewPage, {
      'model': model
    });
  }

  /**
   * Calculating Total per Candidate
   */     
  total(candidate) {
    return (Number(candidate.company_hourly_rate) * Number(candidate.hours)) + Number(candidate.bonus);
  }
}

