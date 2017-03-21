import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController } from 'ionic-angular';

//Pages
import { TransferFormPage } from '../transfer-form/transfer-form';
import { TransferViewPage } from '../transfer-view/transfer-view';

// Providers
import { TransferService } from '../../../../providers/logged-in/transfer.service';
import { CandidateService } from '../../../../providers/logged-in/candidate.service';


// Models
import { Transfer } from '../../../../models/transfer';
import { Candidate } from '../../../../models/candidate';
import { Store } from '../../../../models/store';
import { Subcompanies } from '../../../../models/store';

@Component({
  selector: 'page-transfer-list',
  templateUrl: 'transfer-list.html'
})
export class TransferListPage {

  public transfer: Transfer[];
   public candidate: Candidate[];

  public storeList: Store[];
  public subcompaniesList: Subcompanies[];
  public dataList: { stores: Store[], subcompanies: Subcompanies[]};


  constructor(
    public navCtrl: NavController,
    public transferService: TransferService,
    public candidateService: CandidateService,
    private _modalCtrl: ModalController,
    private _loadingCtrl: LoadingController,
  ) { }

  ionViewDidLoad() {
    this.loadData();
  }


  loadData() {
    // Load list of transfer
    let loader = this._loadingCtrl.create();
    loader.present();
    this.transferService.list().subscribe(response => {
      this.transfer = response;
      loader.dismiss();
    });
  }

//  loadData() {
//     // Load list of candidate
//     this.candidate = [];
//     let loader = this._loadingCtrl.create();
//     loader.present();
//     this.candidateService.list().subscribe(response => {
//       //  this.dataList=response;
//       this.storeList = response.stores;
//       this.subcompaniesList = response.subcompanies;
//       for (let store of response.stores) {
//         for (let cand of store.candidates) {
//           this.candidate.push(cand);
//         }
//       }
//       // this.candidate = response;
//       loader.dismiss();
//     });
//   }

  create() {
    let candidate = [];
    this.candidateService.list().subscribe(response => {
      console.log(response.stores);
      for (let store of response.stores) {
        for (let cand of store.candidates) {
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
  //Transfers details for each transfer_id
  transferDetails(transfer_id:number) {
 // Transfers  Detail Page
    this.navCtrl.push(TransferViewPage, {
      'model': transfer_id
    });

  }


 

}
