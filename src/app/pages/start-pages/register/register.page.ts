import { Component, ViewChild, OnDestroy } from '@angular/core';
import { Platform, AlertController, ModalController, IonContent } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { Browser } from '@capacitor/browser';
import { mergeMap } from 'rxjs/operators';
// models
import { CompanyContact } from 'src/app/models/company-contact';
// validations
import { CustomValidator } from 'src/app/validators/custom.validator';
// services
import { AuthService } from 'src/app/providers/auth.service';
import { EventService } from 'src/app/providers/event.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { CompanyRequest } from 'src/app/models/company-request';
import { Currency } from 'src/app/models/currency';
import { CountryModalComponent } from 'src/app/components/country-modal/country-modal.component';


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

  public model: CompanyRequest;
 
  public type = 'password';

  public showPass = false;

  @ViewChild('input', { static: false }) input;

  createAccountSubscription: Subscription;
  getInviationSubscription: Subscription;

  public borderLimit = false;

  public scrollPosition = 0;

  public currencies: Currency[] = [];

  constructor(
    // private _storage: Storage,
    public platform: Platform,
    private _formService: FormBuilder,
    public authService: AuthService,
    public auth: Auth0Service,
    public eventService: EventService,
    public translateService: TranslateLabelService,
    public analyticService: AnalyticsService,
    private alertCtrl: AlertController,
    public modelCtrl: ModalController,
    private _router: Router,
    private _activeRouter: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.analyticService.page('Register Page');

    this.otp = this._activeRouter.snapshot.params.otp;

    this.eventService.locationUpdated$.subscribe(() => { 

      if(this.registerForm) {

       //this.registerForm.controls['owner_phone_country_code'].setValue(this.authService.currentLocation?.location?.calling_code);
       
       this.registerForm.controls['country_id'].setValue(this.authService.currentLocation?.country?.country_id);
       
       this.registerForm.controls['country'].setValue(this.translateService.langContent(
        this.authService.currentLocation?.country?.country_name, 
        this.authService.currentLocation?.country?.country_name_ar
       ));
       
       //this.registerForm.controls['currency'].setValue(this.authService.currentLocation?.currency?.currency_id);
       this.registerForm.controls['currency_code'].setValue(this.authService.currentLocation?.currency?.code);
      }

      console.log("location updated", this.registerForm.value);
    });

    this._initForm();
  }


  ionViewWillLeave() {
    this.analyticService.track('page_exit', {
      'page': 'Register Page'
    });   

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

    let country_id = 84;
    let country = "Kuwait";
    let currency_code = "KWD";

    if(this.authService.currentLocation) {

      country_id = this.authService.currentLocation?.country?.country_id;
       
      country = this.translateService.langContent(
        this.authService.currentLocation?.country?.country_name, 
        this.authService.currentLocation?.country?.country_name_ar
      );

      currency_code = this.authService.currentLocation?.currency?.code;
    }

    this.registerForm = this._formService.group({
      name: ['', Validators.required],
      company_name: ['', Validators.required],
      contact_position: [''],
      phone_number: ['', Validators.required],
      email: ['', [Validators.required, CustomValidator.emailValidator]],
      password: [''],//, [Validators.required, Validators.minLength(7), Validators.maxLength(30)]
      receive_email: [''],
      requesting_for: [],
      country: [country],
      country_id: [country_id],
      currency_code: [currency_code]
    });

    setTimeout(() => {
      this.input.setFocus();
    }, 1000);

    console.log("location updated", this.registerForm.value);
  }

  async openCountryList() {

    window.history.pushState({
      navigationId: window.history.state.navigationId
    }, null, window.location.pathname);

    const modal = await this.modelCtrl.create({
      component: CountryModalComponent,
    });
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
 
    if (data) {

      this.registerForm.controls.country.setValue(this.translateService.langContent(data.country_name_en, data.country_name_ar));
      this.registerForm.controls.country_id.setValue(data.country_id);
    }
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
          this.model = new CompanyRequest();
        }
        this.model.company_email = data.invitation.email_to_invite;
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
    this.model = new CompanyRequest();
    this.model.contact_name = this.registerForm.value.name;
    this.model.company_email = this.registerForm.value.email;
    this.model.contact_password_hash = this.registerForm.value.password;
    this.model.contact_receive_email = this.registerForm.value.receive_email;
    this.model.requesting_for = this.registerForm.value.requesting_for;
    this.model.phone_number = this.registerForm.value.phone_number;
    this.model.company_name = this.registerForm.value.company_name;
    this.model.contact_position = this.registerForm.value.contact_position;
  }

  /**
   * Submit form to register agent
   */
  registerSubmit() {

    if (this.registerForm.valid) {
      this.isLoading = true;

      this.updateModelFormValues();

      this.createAccountSubscription = this.authService.createAccount(this.model).subscribe(async res => {
 
        this.isLoading = false;

        if (res.operation === 'success') {
 
          this.alertCtrl.create({
            header: this.translateService.transform('Thank you!'),
            message: this.translateService.errorMessage(res.message),
            buttons: ['Okay']
          }).then(alert => {
            alert.present();
          });
 
          this.registerForm.setValue({
            name: '',
            company_name: '',
            contact_position: '',
            phone_number: '',  
            email: '',  
            password: '',  
            receive_email: '',
            requesting_for: ''
          });

          this.registerForm.reset();

          this._router.navigate(['login']);

          /*
          Preferences.set({ 'key': "unVerifiedToken", "value": JSON.stringify(res.unVerifiedToken) }).catch(r => {
            this.eventService.errorStorage$.next();
          });

          this._router.navigate([
            'verify-email',
            res['unVerifiedToken']['email']
          ]);      */

        } else if (res.operation === 'error') {
          this.alertCtrl.create({
            message: this.translateService.errorMessage(res.message),
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
    this.auth
      .buildAuthorizeUrl({ redirect_uri: "co.studenthub.employer://login" })
      .pipe(mergeMap((url) => Browser.open({url, windowName: '_self'})))
      .subscribe();
  }

  loginWithAuth0() {
    if (this.platform.is('capacitor')) {
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
