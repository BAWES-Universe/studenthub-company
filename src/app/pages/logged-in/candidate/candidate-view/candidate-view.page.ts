import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
// models
import { Candidate } from '../../../../models/candidate';
// services
import { CandidateService } from '../../../../providers/logged-in/candidate.service';
import { AwsService } from 'src/app/providers/aws.service';
import {NavController} from '@ionic/angular';


@Component({
  selector: 'app-candidate-view',
  templateUrl: './candidate-view.page.html',
  styleUrls: ['./candidate-view.page.scss'],
})
export class CandidateViewPage implements OnInit {

  public candidate: Candidate;
  public candidate_id;
  public workHistory: any[] = [];
  public loading = false;

  constructor(
    public aws: AwsService,
    public activatedRoute: ActivatedRoute,
    public candidateService: CandidateService,
    public navCtrl: NavController
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
    if (state.model) {
      this.candidate = state.model;
    }
    if (!this.candidate) {
      this.loadData();
    }
  }

  async loadData() {
    // Load list of ALL stores
    this.loading = true;
    this.candidateService.view(this.candidate_id).subscribe(response => {
      if (!response) {
        this.navCtrl.back();
      }
      this.candidate = response;
      this.loading = false;
    });
  }

  loadLogo($event, candidate) {
    candidate.candidate_personal_photo_thumb = null;
  }
}

