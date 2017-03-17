import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, AlertController } from 'ionic-angular';

// Models
import { Candidate } from '../../../../models/candidate';

// Providers
import { CandidateService } from '../../../../providers/logged-in/candidate.service';
@Component({
  selector: 'page-candidate-view',
  templateUrl: 'candidate-view.html'
})
export class CandidateViewPage {

  public candidate: Candidate;


  constructor(
    public navCtrl: NavController,
    private _modalCtrl: ModalController,
    params: NavParams,
    public alertCtrl: AlertController,
    public candidateService: CandidateService,
    private _loadingCtrl: LoadingController,
  ) {
    console.log(params);
    this.candidate = params.get('model');
  }


  ionViewDidLoad() {
   // this.loadData();
  }

  // loadData() {
  //   // Load list of ALL stores
  //   let loader = this._loadingCtrl.create();
  //   loader.present();
  //   this.storeService.list().subscribe(response => {
  //     this.stores = response;
  //     this.stores.forEach((value) => {
  //       if (value.store_id == this.candidate.store_id) {
  //         this.candidate.store_name = value.store_name;
  //         this.candidate.store_id = value.store_id;
  //       }
  //     });
  //     loader.dismiss();
  //   });
  // }

}
