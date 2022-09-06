import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
// models
import { Candidate } from 'src/app/models/candidate';
import { Request } from 'src/app/models/request';
import { AuthService } from 'src/app/providers/auth.service';
import { EventService } from 'src/app/providers/event.service';
// services
import { CompanyRequestService } from '../../../providers/logged-in/company-request.service';
import { RequestCandidateInvitationService } from "../../../providers/logged-in/request-candidate-invitation.service";
import { TranslateLabelService } from "../../../providers/translate-label.service";


@Component({
  selector: 'app-invite',
  templateUrl: './invite.page.html',
  styleUrls: ['./invite.page.scss'],
})
export class InvitePage implements OnInit {

  public borderLimit = false;

  public loadingRequests = false;

  public loading = false;

  public candidate: Candidate;

  public activeRequests: Request[] = [];

  public form: FormGroup;
  public pageCount = 0;
  public currentPage = 1;
  public pages: number[] = [];

  constructor(
    private fb: FormBuilder,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public authService: AuthService,
    public eventService: EventService,
    public invitationService: RequestCandidateInvitationService,
    public requestService: CompanyRequestService,
    public toastCtrl: ToastController,
    public loadCtrl: LoadingController,
    public translateService: TranslateLabelService
  ) { }

  ngOnInit() {
    window.analytics.page('Invite Page');

    this.initForm();
    this.loadRequests();
  }

  initForm() {

    this.form = this.fb.group({
      request_uuid: ['', Validators.required],
      candidate_id: [this.candidate ? this.candidate.candidate_id : null],
    });
  }

  async selectRequest(request) {
    this.form.controls.request_uuid.setValue(request.request_uuid);
    this.form.controls.request_uuid.markAsDirty();
    this.save();
  }

  /**
   * load all requests for parttimers
   */
  loadRequests() {
    this.loadingRequests = true;

    this.requestService.listActiveRequests(1).subscribe(response => {

      this.loadingRequests = false;

      this.activeRequests = response.body;
      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
    }, () => {
      this.loadingRequests = false;
    });
  }

  /**
   * load more on scroll to bottom
   * @param event
   */
  doInfinite(event) {

    this.loading = true;

    this.currentPage++;

    this.requestService.listActiveRequests(this.currentPage).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.activeRequests = this.activeRequests.concat(response.body);
    },
      error => { },
      () => {
        this.loading = false;
        event.target.complete();
      }
    );
  }

  /**
   * Make date readable by Safari
   * @param date
   */
  toDate(date) {
    return (date) ? new Date(date.replace(/-/g, '/')) : null;
  }

  /**
   * save suggestion
   */
  async save() {
    const load = await this.loadCtrl.create();
    load.present();
    this.invitationService.create(this.form.value).subscribe(async response => {

      // On Success
      if (response.operation == 'success') {
        // Close the page

        const prompt = await this.toastCtrl.create({
          message: this.authService.errorMessage(response.message),
          duration: 2000
        });
        prompt.present();
        this.close(true, response.invitedCount);
      }

      // On Failure
      if (response.operation == 'error') {
        const prompt = await this.alertCtrl.create({
          message: this.authService.errorMessage(response.message),
          buttons: [this.translateService.transform('Okay')]
        });
        prompt.present();
      }
    }, () => {
    }, () => {
      load.dismiss();
    });
  }

  /**
   * close popup
   * @param refresh
   * @param invitedCount
   */
  close(refresh = false, invitedCount = null) {
    this.modalCtrl.getTop().then(overlay => {
      if (overlay) {
        overlay.dismiss({
          refresh,
          invitedCount
        });
      }
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
