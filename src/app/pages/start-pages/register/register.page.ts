import { Component, ViewChild, OnDestroy } from '@angular/core';
import { Platform, AlertController, ModalController, IonContent } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { Browser } from '@capacitor/browser';
import { mergeMap } from 'rxjs/operators';
// models
import { Contact, ContactPhone } from 'src/app/models/contact';
import { Company } from 'src/app/models/company';
import { CompanyContact } from 'src/app/models/company-contact';
// validations
import { CustomValidator } from 'src/app/validators/custom.validator';
// services
import { AuthService } from 'src/app/providers/auth.service';
import { EventService } from 'src/app/providers/event.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnDestroy {

  @ViewChild(IonContent, { static: true }) content: IonContent;
 
  public isLoading: boolean;

  public otp;
  // Disable submit button if loading response

  public registerForm: FormGroup;

  public model: Contact;

  public companyContact: CompanyContact;

  public type = 'password';
  public showPass = false;

  @ViewChild('input', { static: false }) input;

  createAccountSubscription: Subscription;
  getInviationSubscription: Subscription;

  public borderLimit = false;

  public scrollPosition = 0;

  constructor(
    // private _storage: Storage,
    public platform: Platform,
    private _formService: FormBuilder,
    public authService: AuthService,
    public auth: Auth0Service,
    public eventService: EventService,
    public translateService: TranslateLabelService,
    private _alertCtrl: AlertController,
    private _router: Router,
    private _activeRouter: ActivatedRoute
  ) {
  }

  ngOnInit() {
    window.analytics.page('Register Page');

    this.otp = this._activeRouter.snapshot.params.otp;

    this._initForm();
  }

  ionViewWillLeave() {
    this.content.getScrollElement().then(ele => {
      this.scrollPosition = ele.scrollTop;
    });
  }

  ngOnDestroy() {
    if (!!this.createAccountSubscription) {
      this.createAccountSubscription.unsubscribe();
    }

    if (!!this.getInviationSubscription) {
      this.getInviationSubscription.unsubscribe();
    }
  }

  /*async ionViewWillEnter() {
    this.content.scrollToPoint(0, this.scrollPosition);

    console.log(this.authService.isLogged);

    if (this.authService.isLogged) {
      this._router.navigate(['/']);
      return null;
    }

    if (this.otp === ':otp') {
      this.otp = null;
    }

    if (this.otp) {
      this.loadInvitation();
    }
  }
*/
  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 25);
  }

  async _initForm() {
    this.registerForm = this._formService.group({
      name: ['', Validators.required],
      company_name: ['', Validators.required],
      contact_position: [''],
      phone_number: ['', Validators.required],
      email: ['', [Validators.required, CustomValidator.emailValidator]],
      password: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(30)]],
      receive_email: ['']
    });

    setTimeout(() => {
      this.input.setFocus();
    }, 1000);
  }

  /**
   * Toggle password visibility for password field
   */
  showPassword() {
    this.showPass = !this.showPass;
    this.type = (this.showPass) ? 'text' : 'password';
  }

  /**
   * Load invitation by otp
   */
  async loadInvitation() {

    this.isLoading = true;

    this.getInviationSubscription = this.authService.getInvitation(this.otp).subscribe(data => {
      this.isLoading = false;

      if (data.invitation && data.invitation.email_to_invite) {
        this.registerForm.controls.email.setValue(data.invitation.email_to_invite);
        // this.registerForm.controls.email.disable();
        if (!this.model) {
          this.model = new Contact();
        }
        this.model.contact_email = data.invitation.email_to_invite;
      } else {
        this.registerForm.controls.email.enable();
        // this.otp = null;
      }
    }, () => {
      this.isLoading = false;
    });
  }

  /**
   * Dismiss page
   */
  dismiss() {
    this._router.navigate(['login']);
  }

  /**
   * Update model from form values
   */
  updateModelFormValues() {
    this.model = new Contact();
    this.model.contact_name = this.registerForm.value.name;
    this.model.contact_email = this.registerForm.value.email;
    this.model.contact_password_hash = this.registerForm.value.password;
    this.model.contact_receive_email = this.registerForm.value.receive_email;

    let contactPhone = new ContactPhone;
    contactPhone.phone_number = this.registerForm.value.phone_number;
    this.model.contactPhones = [contactPhone];

    let company = new Company;
    company.company_name = this.registerForm.value.company_name;
   
    this.companyContact = new CompanyContact;
    this.companyContact.contact_position = this.registerForm.value.contact_position;
    this.companyContact.company = company;
  }

  /**
   * Submit form to register agent
   */
  registerSubmit() {

    if (this.registerForm.valid) {
      this.isLoading = true;

      this.updateModelFormValues();

      this.createAccountSubscription = this.authService.createAccount(this.model, this.companyContact, this.otp).subscribe(res => {

        this.isLoading = false;

        if (res.operation === 'success') {

          Preferences.set({ 'key': "unVerifiedToken", "value": JSON.stringify(res.unVerifiedToken) }).catch(r => {
            this.eventService.errorStorage$.next();
          });

          this._router.navigate([
            'verify-email',
            res['unVerifiedToken']['email']
          ]);      

        } else if (res.operation === 'error') {
          this._alertCtrl.create({
            message: res.message,
            buttons: ['Okay']
          }).then(alert => {
            alert.present();
          });
        }
      },
        error => { this.isLoading = false; },
        () => { this.isLoading = false; }
      );
    }
  }
  
  /**
   * login by Apple API
   */
  loginByApple() {
    if (this.platform.is('ios') && this.platform.is('capacitor')) {
      this.authService.loginByApple();
    } else {
      this.authService.loginByAppleJs();
    }
  }

  /**
   * redirec to auth0
   */
  loginWithRedirect() {
    const url = null;
    this.auth.loginWithRedirect({ redirect_uri: url })
  }

  loginWithAuth0() {
    if (this.platform.is('ios') && this.platform.is('capacitor')) {
      this.loginWithRedirect();
    } else {
      this.auth.loginWithRedirect();
    }
  }

  /**
   * Open login page
   */
  openLoginPage() {
    this._router.navigate(['login']);
  }
}
