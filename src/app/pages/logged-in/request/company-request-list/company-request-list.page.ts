import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonContent, ModalController, NavController, Platform, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
// models
import { Company } from 'src/app/models/company';
import { Request } from 'src/app/models/request';
// services
import { CompanyService } from 'src/app/providers/logged-in/company.service';
import { CompanyRequestService } from 'src/app/providers/logged-in/company-request.service';
import { EventService } from 'src/app/providers/event.service';
import { AuthService } from 'src/app/providers/auth.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-company-request-list',
  templateUrl: './company-request-list.page.html',
  styleUrls: ['./company-request-list.page.scss'],
})
export class CompanyRequestListPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public companies: Company[] = [];

  public loading = false;

  public pageCount = 0;
  public currentPage = 1;
  public pages: number[] = [];
  public requests: Request[] = [];
  
  public segment = 'pending';//started

  public filters: {
    companyName: string,
    requestStatus: string,
    startDate: string
    endDate: string
  } = {
      companyName: null,
      requestStatus: null,
      startDate: null,
      endDate: null
    };

  public requestStats: {
    pending: number,
    started: number,
    delivered: number,
    cancelled: number,
    finished_by_recruitment: number,
    re_work: number,
  } = {
    pending: 0,
    started: 0,
    delivered: 0,
    cancelled: 0,
    finished_by_recruitment: 0,
    re_work: 0
  };

  public min; // min date
  public max; // max date

  public borderLimit = false;

  public scrollPosition = 0;

  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public eventService: EventService,
    public requestService: CompanyRequestService,
    public router: Router,
    public auth: AuthService,
    public analyticService: AnalyticsService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.content.scrollToPoint(0, this.scrollPosition);

    this.analyticService.page('Request List Page');

    this.min = '1930/01/01';

    const d = new Date();
    this.max = (this.platform.is('mobile')) ? d.getFullYear() + '-12-12' : d;

    this.list();

    this.eventService.companyChanged$.subscribe(() => {
      this.list();
    });

    this.eventService.companyRequestUpdate$.subscribe(_ => {
      this.list();
    });
  }

  ionViewWillLeave() {
    this.analyticService.track('page_exit', {
      'page': 'Request List Page'
    });  

    this.content.getScrollElement().then(ele => {
      this.scrollPosition = ele.scrollTop;
    });
  }

  /**
   * refresh 
   * @param event 
   */
  doRefresh(event) {
    this.list(event);
  }

  /**
   * list all requests
   */
  async list(refresher = null) {

    if(!refresher) {
      this.requests = [];
      this.loading = true;
    }

    this.currentPage = 1;
    
    const urlParams = this.urlParams();

    this.requestService.listWithPagination(1, urlParams).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.requests = response.body;

      //this.calculateStats();

      this.requestStats.pending = parseInt(response.headers.get('X-Pending-Count'));
      this.requestStats.cancelled = parseInt(response.headers.get('X-Cancelled-Count'));
      this.requestStats.delivered = parseInt(response.headers.get('X-Completed-Count'));
      this.requestStats.finished_by_recruitment = parseInt(response.headers.get('X-Finished-Count'));
      this.requestStats.started = parseInt(response.headers.get('X-Open-Count'));
      this.requestStats.re_work = parseInt(response.headers.get('X-Rework-Count'));

      if(refresher) {
        refresher.target.complete();
      }
    },
      error => { },
      () => { this.loading = false; }
    );
  }

  /**
   * load more on scroll to bottom
   * @param event
   */
  doInfinite(event) {

    this.loading = true;

    this.currentPage++;

    const urlParams = this.urlParams();

    this.requestService.listWithPagination(this.currentPage, urlParams).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.requests = this.requests.concat(response.body);
      
      //this.calculateStats();

      this.requestStats.pending = parseInt(response.headers.get('X-Pending-Count'));
      this.requestStats.cancelled = parseInt(response.headers.get('X-Cancelled-Count'));
      this.requestStats.delivered = parseInt(response.headers.get('X-Completed-Count'));
      this.requestStats.finished_by_recruitment = parseInt(response.headers.get('X-Finished-Count'));
      this.requestStats.started = parseInt(response.headers.get('X-Open-Count'));
      this.requestStats.re_work = parseInt(response.headers.get('X-Rework-Count'));

    },
      error => { },
      () => {
        this.loading = false;
        event.target.complete();
      }
    );
  }

  /**
   * Return url string to filter list
   */
  urlParams() {
    let urlParams = '';//&per-page=100000

    if (this.filters.companyName) {
      urlParams += '&company_name=' + this.filters.companyName;
    }

    if (this.filters.requestStatus) {
      urlParams += '&request_status=' + this.filters.requestStatus;
    } else {
      urlParams += '&request_status=' + this.segment;// load only current segment's request
    }

    if (this.filters.startDate) {
      urlParams += '&start_date=' + this.filters.startDate;
    }
    if (this.filters.endDate) {
      urlParams += '&end_date=' + this.filters.endDate;
    }
    // urlParams += '&company_id=' + this.auth.company_id;

    return urlParams;
  }

  resetFilter() {
    this.filters = {
      companyName: null,
      requestStatus: null,
      startDate: null,
      endDate: null
    };
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  requestDetail(request) {
    this.navCtrl.navigateForward('/request-view/' + request.request_uuid, {
      state: {
        from: 'company-request-list'
      }
    });
  }

  addRequest() {
    this.navCtrl.navigateForward('/request-form');
  }

  segmentChange(event) {
    this.segment = event.detail.value;

    this.list();
  }

  /*
  calculateStats() {

    this.reset();
    
    this.requests.map(request => {
      if (request.request_status == 'pending' || request.request_status == 're_work')
      {
        this.requestStats.pending.push(request);
      } 
      else if (request.request_status == 'started')
      {
        this.requestStats.open.push(request);
      }
      else if (["finished_by_recruitment", 'delivered'].indexOf(request.request_status) > -1) 
      {
        this.requestStats.completed.push(request);
      }
      else if (request.request_status == 'cancelled'){
        this.requestStats.cancelled.push(request);
      }
    });

    if (this.requestStats.open.length > 0) {
      this.segment = 'open';
    } else if (this.requestStats.completed.length > 0) {
      this.segment = 'completed';
    } else if (this.requestStats.cancelled.length > 0) {
      this.segment = 'cancelled';
    } else {
      this.segment = 'pending';
    }
  }*/

  segmentChanged(event) {
    if(this.segment != event.target.value)
      this.segment = event.target.value;
  }

  reset() {
    this.requests = [];
    this.requestStats = {
        pending: 0,
        started: 0,
        delivered: 0,
        cancelled: 0,
        re_work: 0,
        finished_by_recruitment: 0,
      };
    }
  }
