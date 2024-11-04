import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
// services
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { CandidateService } from 'src/app/providers/logged-in/candidate.service'; 
// models
import {CandidateWorkingDate } from 'src/app/models/candidate';
 

@Component({
  selector: 'app-log-date-list-page',
  templateUrl: './log-date-list.page.html',
  styleUrls: ['./log-date-list.page.scss'],
})
export class LogDateListPage implements OnInit {

  public loading = false;

  public pageCount = 0;
  public currentPage = 1;
  public totalCount = 0;
  public candidate_id: any;

  public candidateWorkingDates: CandidateWorkingDate[] = [];

  constructor(
    public candidateService: CandidateService,
    public translateService: TranslateLabelService,
    public activateRoute: ActivatedRoute,
    public analyticService: AnalyticsService
  ) { }

  ngOnInit() {
    this.candidate_id = this.activateRoute.snapshot.paramMap.get('candidate_id');
    this.analyticService.page('Candidate Working Hours');
  }

  ionViewWillEnter() {
    this.loadData();
  }

  ionViewWillLeave() {
    this.analyticService.track('page_exit', {
      'page': 'Candidate Working Hours'
    });
  }

  doRefresh(event) {
    this.loadData();
    event.target.complete();
  }

  /**
   * load invitations for request
   */
  loadData() {
    this.loading = true;
    const param = `&candidate_id=${this.candidate_id}&expand=health`;
    this.candidateService.listCandidateWorkingDates(this.currentPage, param).subscribe(response => {
      this.loading =  false;
      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));
      this.candidateWorkingDates = response.body;
    });
  }

  /**
   * broadcast scroll event
   * @param e
   */
  logScrolling(e) {
    // this.eventService.tabScrolled$.next({ scrollTop: e.detail.scrollTop });
  }

  /**
   * load more data on scroll to bottom
   * @param event
   */
  doInfinite(event) {

    this.loading = true;

    this.currentPage++;
    const param = `&candidate_id=${this.candidate_id}&expand=health`;
    
    this.candidateService.listCandidateWorkingDates(this.currentPage, param).subscribe(response => {

        this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
        this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
        this.totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));
        this.candidateWorkingDates = this.candidateWorkingDates.concat(response.body);
        event.target.complete();
    },
    error => { },
    () => {
      this.loading = false;
    });
  }
}

