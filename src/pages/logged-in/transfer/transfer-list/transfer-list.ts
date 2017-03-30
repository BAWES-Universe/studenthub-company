import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController, AlertController } from 'ionic-angular';


//Pages
import { TransferFormPage } from '../transfer-form/transfer-form';
import { TransferViewPage } from '../transfer-view/transfer-view';

// Providers
import { TransferService } from '../../../../providers/logged-in/transfer.service';
import { CandidateService } from '../../../../providers/logged-in/candidate.service';


// Models
import { Transfer, TransferListModel, InvoiceListModel } from '../../../../models/transfer';
import { Candidate } from '../../../../models/candidate';
import { Store } from '../../../../models/store';
import { Subcompanies } from '../../../../models/store';

@Component({
  selector: 'page-transfer-list',
  templateUrl: 'transfer-list.html'
})
export class TransferListPage {

  public transfer: TransferListModel[];
  public invoices: InvoiceListModel[];

  public candidate: Candidate[];
  public transferDateFormats: TransferListModel[];

  public storeList: Store[];
  public subcompaniesList: Subcompanies[];
  public dataList: { stores: Store[], subcompanies: Subcompanies[] };


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
    this.loadData();
  }

  loadData() {
    // Load list of transfer
    let loader = this._loadingCtrl.create();
    loader.present();
    this.transferService.list().subscribe(response => {
      this.invoices = response;
      loader.dismiss();
    });
  }


  create() {
    let candidate = [];
    this.candidateService.list().subscribe(response => {
      console.log(response);
      for (let store of response) {
       // for (let cand of store.candidates) {
          candidate.push(store);
       // }
      }
    });
    let modal = this._modalCtrl.create(TransferFormPage, {
      model: new Transfer(),
      candidates: candidate,
      editModel: false
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
  transferDetails(transfer_id: number, status: string) {

    if (status == '10') {
      // Transfers  Detail Page
      this.navCtrl.push(TransferViewPage, {
        'model': transfer_id,
        'transferData': this.transfer
      });
    } else {
      let alert = this.alertCtrl.create({
        title: '',
        subTitle: 'Payment  already intiated',
        buttons: ['OK']
      });
      alert.present();
    }

  }




}
