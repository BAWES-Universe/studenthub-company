import { Component, OnInit } from '@angular/core';
import { NavController } from "@ionic/angular";
import { ActivatedRoute } from "@angular/router";
//models
import { Candidate } from "src/app/models/candidate";
import { Store } from "src/app/models/store";
//services
import { CandidateService } from "src/app/providers/logged-in/candidate.service";
import { AwsService } from 'src/app/providers/aws.service';
import { EventService } from 'src/app/providers/event.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.page.html',
  styleUrls: ['./candidate-list.page.scss'],
})
export class CandidateListPage implements OnInit {

  public candidates: Candidate[];
  public stateTransferName: string;
  public storeList: Store[];
  public loading = false;

  public borderLimit;
  
  constructor(
    public navCtrl: NavController,
    public aws: AwsService,
    public eventService: EventService,
    public candidateService: CandidateService,
    public analyticService: AnalyticsService,
    public params: ActivatedRoute,
  ) {
    // this.stateTransferName = params.get('model');
  }

  ngOnInit() {
    this.analyticService.page('Candidate List Page');

    this.eventService.companyChanged$.subscribe(() => {
      this.loadCandidateList();
    });

    this.loadCandidateList();
  }

  ionViewWillLeave() {
    this.analyticService.track('page_exit', {
      'page': 'Candidate List Page'
    });
  }

  /**
   * Load list of candidates
   */
  async loadCandidateList() {
    this.candidates = [];

    this.loading = true;
    this.candidateService.list().subscribe(response => {
      this.candidates = response;
    },
      (error) => { },
      () => {
        this.loading = false;
      });
  }

  /**
   * On Candidate Selected
   * @param model
   */
  rowSelected(model) {
    this.navCtrl.navigateForward('candidate-view/' + model.candidate_id, {
      state: {
        model: model
      }
    });
  }
  
  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  onImageError(candidate) {
    candidate.candidate_personal_photo = null;
  }
}
