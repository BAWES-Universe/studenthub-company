import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, AlertController, IonContent } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
// form
import { CustomValidator } from '../../../../../validators/custom.validator';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
// services

import { AuthService } from 'src/app/providers/auth.service';
import { InvitationService } from 'src/app/providers/logged-in/invitation.service';
import { EventService } from 'src/app/providers/event.service';


@Component({
  selector: 'app-invitation-form',
  templateUrl: './invitation-form.page.html',
  styleUrls: ['./invitation-form.page.scss'],
})
export class InvitationFormPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public scrollPosition = 0;

  public loading = false;

  public form: FormGroup;

  public role: number;

  public inviteSubscription: Subscription;

  public borderLimit = false;

  constructor(
    public route: ActivatedRoute,
    private _fb: FormBuilder,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public invitationService: InvitationService,
    public authService: AuthService,
    public eventService: EventService
  ) { }

  ngOnInit() {
    window.analytics.page('Invitation Form Page');

    this.initForm();
  }

  async initForm() {
    this.form = this._fb.group({
      email_to_invite: ['', [Validators.required, CustomValidator.emailValidator]],
      role: [this.role, Validators.required]
    });
  }

  ionViewWillLeave() {
    this.content.getScrollElement().then(ele => {
      this.scrollPosition = ele.scrollTop;
    });
  }

  ionViewDidEnter() {
    this.content.scrollToPoint(0, this.scrollPosition);
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 25);
  }

  submitForm() {

    this.loading = true;

    const params = {
      email_to_invite: this.form.value.email_to_invite,
      role: this.form.value.role,
      company_id: this.authService.company_id
    };

    this.inviteSubscription = this.invitationService.invite(params).subscribe(response => {

      this.inviteSubscription.unsubscribe();

      this.loading = false;

      if (response.operation == 'success') {
        this.eventService.loadInvitation$.next();
        this.dismiss({ refresh: true });
      } else {
        this._handleError(response);
      }
    }, () => {
      this.loading = false;
    });
  }

  dismiss(data = {}) {
    this.modalCtrl.getTop().then(overlay => {
      if (overlay) {
        overlay.dismiss(data);
      }
    });
  }

  /**
   * Process error message in API response
   * @param response
   */
  _handleError(response) {
    this.alertCtrl.create({
      message: response.message,
      buttons: ['Try Again'],
    }).then(alert => {
      alert.present();
    });
  }
}
