import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController, NavParams } from 'ionic-angular';

import { CandidateViewPage } from '../candidate-view/candidate-view';
// Providers
import { CandidateService } from '../../../../providers/logged-in/candidate.service';
// Models
import { Candidate } from '../../../../models/candidate';
import { Store } from '../../../../models/store';
import { Subcompanies } from '../../../../models/store';

@Component({
  selector: 'page-candidate-list',
  templateUrl: 'candidate-list.html'
})
export class CandidateListPage {

  public candidate: Candidate[];
  public stateTransferName: string;
  public storeList: Store[];
  public subcompaniesList: Subcompanies[];
  public dataList: { stores: Store[], subcompanies: Subcompanies[] }

  constructor(
    public navCtrl: NavController,
    public candidateService: CandidateService,
    private _modalCtrl: ModalController,
    private _loadingCtrl: LoadingController,
    public params: NavParams,
  ) {
    this.stateTransferName = params.get('model');

  }

  ionViewDidLoad() {
    this.loadData();
  }

  loadData() {
    // Load list of candidate
    this.candidate = [];
    let loader = this._loadingCtrl.create();
    loader.present();
    this.candidateService.list().subscribe(response => {
      //  this.dataList=response;
      // this.storeList = response.stores;
      // this.subcompaniesList = response.subcompanies;
       this.storeList = response;
     // this.subcompaniesList = response.subcompanies;
     // if(){
      for (let store of response) {
       // for (let cand of store.candidates) {
          this.candidate.push(store);
      //  }
      }
    //  }
      // this.candidate = response;
      loader.dismiss();
    });
  }

  rowSelected(model) {
    console.log(model);
    // Load Detail Page
    this.navCtrl.push(CandidateViewPage, {
      'model': model
    });
  }

}
