import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
//models
import { Contact } from 'src/app/models/contact';
import { AccountService } from 'src/app/providers/logged-in/account.service';
import { AuthService } from 'src/app/providers/auth.service';
//validator
import { CustomValidator } from 'src/app/validators/custom.validator';
import {TranslateLabelService} from "../../../providers/translate-label.service";


@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  public form: FormGroup;

  public saving: boolean = false;

  public loading: boolean = false;

  public model: Contact;

  public borderLimit;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public authService: AuthService,
    public accountService: AccountService,
    private _fb: FormBuilder,
    private translateLabelService: TranslateLabelService
  ) { }

  ngOnInit() {
    window.analytics.page('Account Page');

    this.loadData();
  }

  /**
   * load account detail
   */
  loadData() {
    this.loading = true;

    this.accountService.view().subscribe(data => {
      this.model = data;

      this.initForm();

      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }

  initForm() {
    let emailCtrls = [];

    let phoneCtrls = [];

    if(this.model.contactEmails)
      for (let contactEmail of this.model.contactEmails) {
        emailCtrls.push(this._fb.group({
          email_address: [contactEmail.email_address, []]//CustomValidator.emailValidator
        }));
      }

    if(this.model.contactPhones)
      for (let contactPhone of this.model.contactPhones) {
        phoneCtrls.push(this._fb.group({
          phone_number: [contactPhone.phone_number, []]
        }));
      }

    emailCtrls.push(this._fb.group({
      email_address: ['', []]//CustomValidator.emailValidator
    }));

    phoneCtrls.push(this._fb.group({
      phone_number: ['', []]
    }));

    this.form = this._fb.group({
      name: [this.model.contact_name, Validators.required],
      //position: [this.model.contact_position, Validators.required],
      email: [this.model.contact_email, [CustomValidator.emailValidator, Validators.required]],
      receive_email: [this.model.contact_receive_email],
      receive_notification: [this.model.contact_receive_notification],
      emails: new FormArray(emailCtrls),
      phones: new FormArray(phoneCtrls),
    });
  }

  // convenience getters for easy access to form fields
  get f() { return this.form.controls; }
  get emails() { return this.f.emails as FormArray; }
  get phones() { return this.f.phones as FormArray; }

  /**
   * Update Model Data based on Form Input
   */
  updateModelDataFromForm() {
    this.model.contact_name = this.form.value.name;
    this.model.contact_email = this.form.value.email;
    this.model.contact_receive_email = this.form.value.receive_email;
    this.model.contact_receive_notification = this.form.value.receive_notification;
    //this.model.contact_position = this.form.value.position;
    this.model.contactEmails = this.form.value.emails;
    this.model.contactPhones = this.form.value.phones;
  }

  removeEmail(index) {
    this.emails.removeAt(index);
    this.emails.markAsDirty();
  }

  removePhone(index) {
    this.phones.removeAt(index);
    this.phones.markAsDirty();
  }

  addEmail() {
    this.emails.push(this._fb.group({
      email_address: ['', []]//CustomValidator.emailValidator
    }));
  }

  addPhone() {
    this.phones.push(this._fb.group({
      phone_number: ['', []]
    }));
  }

  /**
   * add new input
   * @param event
   * @param index
   */
  onPhoneChange(event, index) {

    // remove field on clearing it out + have next empty field

    if (this.phones.length - index > 1 && event.target.value.length == 0) {
      return this.removePhone(index);
    }

    // check if new field is not added && something is typed
    if (((index - this.phones.length) === -1) && event.target.value) {
      // adding new field
      this.addPhone();
    }
  }

  /**
   * Save the model
   */
  async save() {

    this.saving = true;

    this.updateModelDataFromForm();

    this.accountService.update(this.model).subscribe(async jsonResponse => {

      this.saving = false;

      // On Success
      if (jsonResponse.operation == "success") {

        this.authService.profile_name = this.model.contact_name;
        this.authService.email = this.model.contact_email;
        this.authService.saveInStorage();

        this.navCtrl.navigateRoot(['/']);
      }

      // On Failure
      if (jsonResponse.operation == "error") {
        let prompt = await this.alertCtrl.create({
          message: JSON.stringify(jsonResponse.message),
          buttons: [this._translate('Okay')]
        });
        prompt.present();
      }
    }, () => {
      this.saving = false;
    });
  }

  /**
   * add new input
   * @param event
   * @param index
   */
  onEmailChange(event, index) {

    // remove field on clearing it out + have next empty field

    if (this.emails.length - index > 1 && event.target.value.length == 0) {
      return this.removeEmail(index);
    }

    // check if new field is not added && something is typed
    if (((index - this.emails.length) === -1) && event.target.value) {
      // adding new field
      this.addEmail();
    }
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  _translate(lbl) {
    return this.translateLabelService.transform(lbl);
  }
}
