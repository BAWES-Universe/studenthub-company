import { Component, OnInit } from '@angular/core';
import {AlertController, ModalController, PopoverController} from '@ionic/angular';
// models
import { Company } from 'src/app/models/company';
// services
import { CompanyContactService } from 'src/app/providers/logged-in/company-contact.service';
import {ModalPopPage} from "../../modal-pop/modal-pop.page";
import {InvitationPermissionPage} from "../../company/invitation/invitation-permission/invitation-permission.page";
import {InvitationService} from "../../../../providers/logged-in/invitation.service";
import {ContactInvitation} from "../../../../models/contact.invitation";
import {EventService} from "../../../../providers/event.service";


@Component({
  selector: 'app-company-contact-list',
  templateUrl: './company-contact-list.page.html',
  styleUrls: ['./company-contact-list.page.scss'],
})
export class CompanyContactListPage implements OnInit {

  public company: Company;
  public pendingSentContactInvitationList: ContactInvitation[];

  public inProgress = 'Team-list';

  public contacts;

  public contactList = [];

  public currentPage: number;

  public pageCount: number;

  public loading = false;

  public query = '';

  public borderLimit = false;

  constructor(
    public companyContactService: CompanyContactService,
    public invitationService: InvitationService,
    public popupCtrl: PopoverController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public eventService: EventService
  ) {
    this.eventService.loadInvitation$.subscribe(_ => {
      this.loadPendingSentList();
    });
  }

  ngOnInit() {
    this.loadData();
    this.loadPendingSentList();
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
  loadPendingSentList() {

    this.loading = true;

    this.pendingSentContactInvitationList = [];

    this.invitationService.pendingSentList().subscribe(response => {
      this.loading = false;

      this.pendingSentContactInvitationList = response;
    }, () => {
      this.loading = false;
    });
  }

  async removeInvitation(data: ContactInvitation) {
    this.loading = true;

    this.invitationService.remove(data.contact_invitation_uuid).subscribe(response => {

      if (response.operation == 'success') {
        this.loadPendingSentList();
      } else {

        this.loading = false;

        this.alertCtrl.create({
          message: response.message,
          buttons: ['Okay']
        }).then(prompt => {
          prompt.present();
        });
      }
    });
  }

}
