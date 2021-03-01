import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
// models
import { Candidate } from 'src/app/models/candidate';
import { Request } from 'src/app/models/request';
import { AuthService } from 'src/app/providers/auth.service';
import { EventService } from 'src/app/providers/event.service';
// services
import { CompanyRequestService } from '../../../providers/logged-in/company-request.service';
import { RequestCandidateInvitationService } from "../../../providers/logged-in/request-candidate-invitation.service";


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
    public requestService: CompanyRequestService
  ) { }

  ngOnInit() {
    this.initForm();
    this.loadRequests();
  }

  initForm() {

    this.form = this.fb.group({
      request_uuid: ['', Validators.required],
      candidate_id: [this.candidate ? this.candidate.candidate_id : null],
    });
  }

  selectRequest(request) {
    this.form.controls.request_uuid.setValue(request.request_uuid);
    this.form.controls.request_uuid.markAsDirty();
    this.save();
  }

  /**
   * load all requests for parttimers
   */
  loadRequests() {
    this.loadingRequests = true;

    this.requestService.listActiveRequests(1, '&position_type=2').subscribe(response => {

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

    const urlParams = '&position_type=2';

    this.requestService.listActiveRequests(this.currentPage, urlParams).subscribe(response => {

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
  save() {
    this.loading = true;

    this.invitationService.create(this.form.value).subscribe(async response => {

      this.loading = false;

      // On Success
      if (response.operation == 'success') {
        // Close the page
        this.close(true, response.invitedCount);
      }

      // On Failure
      if (response.operation == 'error') {
        const prompt = await this.alertCtrl.create({
          message: this.authService.errorMessage(response.message),
          buttons: ['Okay']
        });
        prompt.present();
      }
    }, () => {
      this.loading = false;
    });
  }

  /**
   * close popup
   * @param refresh
   * @param invitedCount
   */
  close(refresh = false, invitedCount = null) {
    this.modalCtrl.dismiss({
      refresh,
      invitedCount
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
