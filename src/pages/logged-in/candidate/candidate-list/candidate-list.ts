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

  public pageCount = 0;
  public currentPage = 1;
  public pages: number[] = [];

  public candidates: Candidate[];
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
    this.loadData(this.currentPage);
  }

  loadData(page: number) {
    // Load list of candidate
    this.candidates = [];
    let loader = this._loadingCtrl.create();
    loader.present();
    this.candidateService.list(page).subscribe(response => {

      this.pageCount = response.headers.get('X-Pagination-Page-Count');
      this.currentPage = response.headers.get('X-Pagination-Current-Page');

      this.pages = [];

      for(var i = 1; i <= this.pageCount; i++){
         this.pages.push(i);
      }

      //hide if no page = 1 

      if(this.pageCount == 1)
        this.pages = [];

      //  this.dataList=response;
      // this.storeList = response.stores;
      // this.subcompaniesList = response.subcompanies;
       
     // this.subcompaniesList = response.subcompanies;
     // if(){
      for (let candidate of response.json()) {
       // for (let cand of store.candidates) {
          this.candidates.push(candidate);
      //  }
      }
    //  }
      // this.candidate = response;
      loader.dismiss();
    });
  }

  pageLinkColor(page: number) {

    if(page == this.currentPage) 
      return 'light';
    
    return '';
  }

  rowSelected(model) {
    
    // Load Detail Page
    this.navCtrl.push(CandidateViewPage, {
      'model': model
    });
  }

}
