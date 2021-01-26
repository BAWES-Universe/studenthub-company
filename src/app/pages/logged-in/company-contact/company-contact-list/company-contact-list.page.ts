import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
// models
import { Company } from 'src/app/models/company';
// services
import { CompanyContactService } from 'src/app/providers/logged-in/company-contact.service';
import { InvitationService } from 'src/app/providers/logged-in/invitation.service';
import { ContactInvitation } from 'src/app/models/contact.invitation';
import { EventService } from 'src/app/providers/event.service';
import { AuthService } from "../../../../providers/auth.service";
//pages
import { ModalPopPage } from '../../modal-pop/modal-pop.page';
import { InvitationPermissionPage } from 'src/app/pages/logged-in/company/invitation/invitation-permission/invitation-permission.page';


@Component({
  selector: 'app-company-contact-list',
  templateUrl: './company-contact-list.page.html',
  styleUrls: ['./company-contact-list.page.scss'],
})
export class CompanyContactListPage implements OnInit, OnDestroy {

  public company: Company;

  public invitation = {
    sent: [],
    received: []
  };

  public inProgress = 'Team-list';

  public contacts;

  public contactList = [];

  public currentPage: number;

  public pageCount: number;

  public loading = false;

  public query = '';

  public borderLimit = false;
  public invitationCheckLoop;

  constructor(
    public companyContactService: CompanyContactService,
    public invitationService: InvitationService,
    public popupCtrl: PopoverController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public eventService: EventService,
    public authService: AuthService
  ) {
    this.eventService.loadInvitation$.subscribe(_ => {
      this.loadInvitationList();
    });
  }

  ngOnInit() {
    this.loadData();
    this.loadInvitationList();

    if (!this.invitationCheckLoop) {
      this.invitationCheckLoop = setInterval(() => {
        this.loadInvitationList(true);
      }, 3000);
    }
  }

  ngOnDestroy() {
    if (this.invitationCheckLoop) {
      clearInterval(this.invitationCheckLoop);
    }
  }

  /**
   * load all contacts
   */
  loadData() {
    this.loading = true;

    this.currentPage = 1;

    this.contactList = [];

    this.companyContactService.list(this.currentPage, this.query).subscribe(response => {

      this.loading = false;
      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.contactList = response.body;
    },
      () => {
        this.loading = false;
      });
  }

  /**
   * infinite loader on scroll
   * @param event
   */
  doInfinite(event) {
    this.loading = true;

    this.currentPage++;

    this.companyContactService.list(this.currentPage, this.query).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.contactList = this.contactList.concat(response.body);
    },
      error => { },
      () => {
        this.loading = false;
        event.target.complete();
      });
  }

  doNothing(event) {
    event.stopPropagation();
  }

  /**
   * close popup on selection
   * @param companyContact
   */
  dismiss(companyContact = null) {

    this.popupCtrl.getTop().then(overlay => {
      if (overlay) {
        this.popupCtrl.dismiss({ companyContact });
      } else {
        this.modalCtrl.dismiss({ companyContact });
      }
    });
  }

  /**
   * filter contacts
   * @param ev
   */
  filter(ev) {

    // filter from all companies

    if (!this.company) {
      return this.loadData();
    }

    // filter from given company

    this.loading = true;

    this.contactList = [];

    this.companyContactService.companyContacts(this.company.company_id, this.query).subscribe(response => {
      this.loading = false;

      this.contactList = response;
    }, () => {
      this.loading = false;
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  /**
   * open form to invite new staff member
   */
  async openInviteStaffForm() {

    window.history.pushState({
      navigationId: window.history.state.navigationId
    }, null, window.location.pathname);

    const loginModal = await this.modalCtrl.create({
      component: ModalPopPage,
      componentProps: {
        activatedRoutePath: InvitationPermissionPage
      }
    });
    loginModal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }

      if (e.data && e.data.refresh) {
        // this.showSaveBtn = true;
        // this.loadData(null, true); // refresh in background
      }
    });
    await loginModal.present().then(() => {
      // this.ga.trackView('Invitation Permission', '/invitation-permission');
    });
  }

  /**
   * load pending sent list
   */
  loadInvitationList(silentLoading = false) {

    if (!silentLoading) {
      this.loading = true;
    }

    this.invitation.received = [];
    this.invitation.sent = [];

    this.invitationService.invitationList().subscribe(response => {
      this.loading = false;

      this.invitation.received = response.invitationReceived;
      this.invitation.sent = response.invitationSent;
    }, () => {
      this.loading = false;
    });
  }

  async removeInvitation(data: ContactInvitation) {
    this.loading = true;

    this.invitationService.remove(data.contact_invitation_uuid).subscribe(response => {

      if (response.operation == 'success') {
        this.loadInvitationList();
      } else {

        this.loading = false;

        this.alertCtrl.create({
          message: this.authService.errorMessage(response.message),
          buttons: ['Okay']
        }).then(prompt => {
          prompt.present();
        });
      }
    });
  }

  async accept(data: ContactInvitation) {
    this.loading = true;

    this.invitationService.accept(data.contact_invitation_uuid).subscribe(response => {

      if (response.operation == 'success') {
        this.loadInvitationList();
      } else {

        this.loading = false;

        this.alertCtrl.create({
          message: this.authService.errorMessage(response.message),
          buttons: ['Okay']
        }).then(prompt => {
          prompt.present();
        });
      }
    });
  }

  async removeMember(contact) {
    console.log(contact);
  }
}
