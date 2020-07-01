import { Component, OnInit } from '@angular/core';
import { LoadingController } from "@ionic/angular";
import { ActivatedRoute } from "@angular/router";
//models
import { Candidate } from "../../../../models/candidate";
//services
import { CandidateService } from "../../../../providers/logged-in/candidate.service";


@Component({
  selector: 'app-candidate-view',
  templateUrl: './candidate-view.page.html',
  styleUrls: ['./candidate-view.page.scss'],
})
export class CandidateViewPage implements OnInit {

  public candidate: Candidate;
  public candidate_id;
  public workHistory: any[] = [];
  public permanentBucketUrl = "https://sh-payroll.s3.eu-west-2.amazonaws.com/";
  public loading = false;
  constructor(
    public activatedRoute: ActivatedRoute,
    public candidateService: CandidateService
  ) {
    this.candidate_id = this.activatedRoute.snapshot.paramMap.get('id');
    this.loadWorkHistoryData();
  }


  /**
   * Load candidate work history data
   */
  loadWorkHistoryData() {
    this.candidateService.workHistory(this.candidate_id).subscribe(response => {
      this.workHistory = response;
    });
  }

  ngOnInit() {
    const state = window.history.state;
    if (state['model']) {
      this.candidate = state['model'];
    }
    if (!this.candidate) {
      this.loadData();
    }
  }

  async loadData() {
    // Load list of ALL stores
    this.loading = true;
    this.candidateService.view(this.candidate_id).subscribe(response => {
      this.candidate = response;
      this.loading = false;
    });
  }

  // async loadData() {
  //   // Load list of ALL stores
  //   let loader = await this._loadingCtrl.create();
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

