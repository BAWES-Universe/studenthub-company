import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController } from 'ionic-angular';

//Pages
import { TransferFormPage } from '../transfer-form/transfer-form';

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

  public transfer: Transfer[];


  constructor(
    public navCtrl: NavController,
    public transferService: TransferService,
    public candidateService: CandidateService,
    private _modalCtrl: ModalController,
    private _loadingCtrl: LoadingController,
  ) {}

  ionViewDidLoad() {
    this.loadData();
  }

 
  loadData(){
    // Load list of transfer
    let loader = this._loadingCtrl.create();
    loader.present();
    this.transferService.list().subscribe(response => { 
      this.transfer = response;
      loader.dismiss();
    });
  }

  create() {
      let candidate = [];
      this.candidateService.list().subscribe(response => {
        console.log(response.stores);
        for(let store of response.stores) {
          for(let cand of store.candidates) {
             candidate.push(cand);
          }
        }
      });
      let modal = this._modalCtrl.create(TransferFormPage, {
      model: new Transfer(),
      candidates: candidate
      });
      // Refresh List if required
      modal.onDidDismiss(data => {
      if (data) {
        if (data.refresh) {
          this.loadData();
        }
      }
      });
      modal.present();
      }
 }
