import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController } from 'ionic-angular';

import { CandidateViewPage } from '../candidate-view/candidate-view';
// Providers
import { CandidateService } from '../../../../providers/logged-in/candidate.service';
// Models
import { Candidate } from '../../../../models/candidate';

@Component({
  selector: 'page-candidate-list',
  templateUrl: 'candidate-list.html'
})
export class CandidateListPage {

  public candidate: Candidate[];

  constructor(
    public navCtrl: NavController,
    public candidateService: CandidateService,
    private _modalCtrl: ModalController,
    private _loadingCtrl: LoadingController,
  ) {}

  ionViewDidLoad() {
    this.loadData();
  }

  loadData(){
    // Load list of candidate
    this.candidate = [];
    let loader = this._loadingCtrl.create();
    loader.present();
    this.candidateService.list().subscribe(response => {
      console.log(response.stores);
      for(let store of response.stores) {
        for(let cand of store.candidates) {
           this.candidate.push(cand);
        }
      }
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
