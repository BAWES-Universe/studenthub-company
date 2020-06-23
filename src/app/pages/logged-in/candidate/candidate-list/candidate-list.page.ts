import { Component, OnInit } from '@angular/core';
import {LoadingController, NavController} from "@ionic/angular";
import {ActivatedRoute} from "@angular/router";
//models
import {Candidate} from "src/app/models/candidate";
import {Store} from "../../../../models/store";
//services
import {CandidateService} from "src/app/providers/logged-in/candidate.service";

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.page.html',
  styleUrls: ['./candidate-list.page.scss'],
})
export class CandidateListPage implements OnInit {

  public candidates: Candidate[];
  public stateTransferName: string;
  public storeList: Store[];

  constructor(
      public navCtrl: NavController,
      public candidateService: CandidateService,
      private _loadingCtrl: LoadingController,
      public params: ActivatedRoute,
  ) {
    // this.stateTransferName = params.get('model');
  }

  ngOnInit() {
    this.loadCandidateList();
  }

  /**
   * Load list of candidates
   */
  async loadCandidateList() {
    this.candidates = [];

    let loader = await this._loadingCtrl.create();
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
    this.navCtrl.navigateForward('candidate-view/'+model.candidate_id,{
      state : {
        model:model
      }
    });
  }
}
