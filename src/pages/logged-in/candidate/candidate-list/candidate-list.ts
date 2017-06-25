import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController, NavParams } from 'ionic-angular';

import { CandidateViewPage } from '../candidate-view/candidate-view';
// Providers
import { CandidateService } from '../../../../providers/logged-in/candidate.service';
// Models
import { Candidate } from '../../../../models/candidate';
import { Store } from '../../../../models/store';

@Component({
  selector: 'page-candidate-list',
  templateUrl: 'candidate-list.html'
})
export class CandidateListPage {
  public candidates: Candidate[];
  public stateTransferName: string;
  public storeList: Store[];

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
    this.loadCandidateList();
  }

  /**
   * Load list of candidates
   */
  loadCandidateList() {
    this.candidates = [];

    let loader = this._loadingCtrl.create();
    loader.present();
    this.candidateService.list().subscribe(response => {
      this.candidates = response;
    }, 
    (error) => {}, 
    () => {
      loader.dismiss();
    });
  }

  /**
   * On Candidate Selected
   * @param model 
   */
  rowSelected(model) {
    // Load Detail Page
    this.navCtrl.push(CandidateViewPage, {
      'model': model
    });
  }

}