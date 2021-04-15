import { Component, ViewChild } from '@angular/core';
import { AlertController, ModalController, IonContent } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import {InvitationService} from 'src/app/providers/logged-in/invitation.service';
// service

// models
// import { AgentInvitation } from "../../../../../models/agent.invitation";


@Component({
  selector: 'app-invite-staff-view',
  templateUrl: './invite-staff-view.page.html',
  styleUrls: ['./invite-staff-view.page.scss'],
})
export class InviteStaffViewPage {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public scrollPosition = 0;

  public invitation: any;

  invitationAcceptSubscription: Subscription;

  invitationRejectSubscription: Subscription;

  public borderLimit = false;

  constructor(
    public invitationService: InvitationService,
    private _alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public navParams: ActivatedRoute
  ) {
    this.invitation = this.navParams.snapshot.params.invitation;
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

  /**
   * Accept invitation
   */
  async accept() {

    this.invitationAcceptSubscription = this.invitationService.accept(this.invitation.agent_invitation_uuid).subscribe(response => {

      this.invitationAcceptSubscription.unsubscribe();

      if (response.operation == 'success') {
        this.dismiss({ accepted: true });
      } else {

        this._alertCtrl.create({
          message: response.message,
          buttons: ['Okay']
        }).then(prompt => {
          prompt.present();
        });

        this.dismiss({ accepted: false }); // refresh company list
      }
    });
  }

  /**
   * Reject invitation
   */
  async reject() {

    this.invitationRejectSubscription = this.invitationService.reject(this.invitation.agent_invitation_uuid).subscribe(response => {

      this.invitationRejectSubscription.unsubscribe();

      if (response.operation != 'success') {
        this._alertCtrl.create({
          message: response.message,
          buttons: ['Okay']
        }).then(prompt => {
          prompt.present();
        });
      }

      this.dismiss({ accepted: false });
    });
  }

  /**
   * Dismiss view
   * @param data
   */
  dismiss(data = {}) {
    this.modalCtrl.getTop().then(overlay => {
      if (overlay) {
        overlay.dismiss(data);
      }
    });
  }
}

