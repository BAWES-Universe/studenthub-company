import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//models
import { CompanyContact } from 'src/app/models/company-contact';
import { Contact } from 'src/app/models/contact';
import { Note } from 'src/app/models/note';
//services
import { CompanyContactService } from 'src/app/providers/logged-in/company-contact.service';
import { NoteService } from 'src/app/providers/logged-in/note.service';


@Component({
  selector: 'app-company-contact-view',
  templateUrl: './company-contact-view.page.html',
  styleUrls: ['./company-contact-view.page.scss'],
})
export class CompanyContactViewPage implements OnInit {

  public contact_uuid: string;

  public company_id;

  public loading: boolean = false;

  public contact: Contact;

  public companyContact: CompanyContact;

  public notes: Note[] = [];

  public pageCount: number;

  public currentPage: number;

  public borderLimit;

  constructor(
    public route: ActivatedRoute,
    public noteService: NoteService,
    public companyContactService: CompanyContactService
  ) { }

  ngOnInit() {

    if(!this.contact_uuid)
      this.contact_uuid = this.route.snapshot.params.contact_uuid;

    this.company_id = this.route.snapshot.params.company_id;

    const model = window.history.state.model;

    if(model) {
      this.contact = model;
    }

    this.loadDetail();
    
    this.loadNotes();

    if(!this.companyContact) {
      this.loadCompanyContact();
    }
  }

  /**
   * load role details
   */
  loadCompanyContact() {
    this.companyContactService.viewCompanyContact(this.contact_uuid).subscribe(data => {
      this.companyContact = data;
    });
  }

  /**
   * load request detail
   */
  loadDetail() {
    this.loading = true;

    this.companyContactService.view(this.contact_uuid).subscribe(data => {
      this.contact = data;
    }, () => {
    }, () => {
      this.loading = false;
    });
  }

  /**
   * Make date readable by Safari
   * @param date
   */
  toDate(date) {
    if (date)
      return new Date(date.replace(/-/g, '/'));
  }

  /**
   * load notes
   */
  loadNotes() {
    const searchParams = this.urlParams();

    this.noteService.list(searchParams, 1).subscribe(async response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.notes = response.body;
    });
  }

  urlParams() {
    return '&contact_uuid=' + this.contact_uuid;
  }

  /**
   * load more on scroll to bottom
   * @param event
   */
  doInfinite(event) {

    const searchParams = this.urlParams();

    this.currentPage++;

    this.noteService.list(searchParams, this.currentPage).subscribe(response => {

      this.pageCount = parseInt(response.headers.get('X-Pagination-Page-Count'));
      this.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));

      this.notes = this.notes.concat(response.body);
    },
      error => { },
      () => { event.target.complete(); }
    );
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 0);
  }
}
