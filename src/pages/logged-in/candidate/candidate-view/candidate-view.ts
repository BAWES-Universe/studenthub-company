import { Component } from '@angular/core';
import { NavParams, LoadingController } from 'ionic-angular';

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
  public workHistory: any[] = [];
  public permanentBucketUrl = "https://sh-payroll.s3.eu-west-2.amazonaws.com/";

  constructor(
    params: NavParams,
    public candidateService: CandidateService,
    private _loadingCtrl: LoadingController,
  ) {
    // console.log(params);
    this.candidate = params.get('model');
    this.loadWorkHistoryData();
  }


    /**
   * Load candidate work history data
   */
  loadWorkHistoryData() {
    this.candidateService.workHistory(this.candidate).subscribe(response => {
      this.workHistory = response;
    });
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
