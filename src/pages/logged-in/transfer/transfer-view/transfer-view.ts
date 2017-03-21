import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, AlertController } from 'ionic-angular';

// Providers
import { TransferService } from '../../../../providers/logged-in/transfer.service';
import { CandidateService } from '../../../../providers/logged-in/candidate.service';

// Models
import { TransferDetails, TransferListModel } from '../../../../models/transfer';
import { Candidate } from '../../../../models/candidate';

@Component({
  selector: 'page-transfer-view',
  templateUrl: 'transfer-view.html'
})
export class TransferViewPage {
  public transferDetails: TransferDetails[];
  public transferData: TransferListModel[];
  public transfer_id: number;
  public candidate: Candidate[];
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
      this.candidate = response.candidates;
      loader.dismiss();
    });
  }


  transferLock(transfer_id: number) {
    // Load list of transfer
    let loader = this._loadingCtrl.create();
    loader.present();
     this.transferService.makeTransfertoLock(transfer_id).subscribe(response => {
    this.transferData.forEach((element) => {
      if (Number(element.transfer_id) == transfer_id) {
        element.edit_transfer_status = "Payment Intiated";
      }
    });

    this.navCtrl.pop();
    loader.dismiss();
     });
  }


}

