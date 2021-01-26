import { Component, ViewChild, OnDestroy } from '@angular/core';
import { Platform, AlertController, ModalController, IonContent } from '@ionic/angular';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
// models
import { Contact } from 'src/app/models/contact';
import {AuthService} from 'src/app/providers/auth.service';
import {CustomValidator} from 'src/app/validators/custom.validator';
// services

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnDestroy {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public isMobile: boolean;
  public isLoading: boolean;

  public otp;
  // Disable submit button if loading response

  public registerForm: FormGroup;
  public model: Contact;

  public type = 'password';
  public showPass = false;

  @ViewChild('input', { static: false }) input;

  createAccountSubscription: Subscription;
  getInviationSubscription: Subscription;

  public borderLimit = false;

  public scrollPosition = 0;

  constructor(
    // private _storage: Storage,
    private _formService: FormBuilder,
    public authService: AuthService,
    private _alertCtrl: AlertController,
    private _platform: Platform,
    private _modalCtrl: ModalController,
    private _router: Router,
    private _activeRouter: ActivatedRoute
  ) {
    this.isMobile = this.isLoading = false;

    this._platform.ready().then(() => {
      if (this._platform.is('capacitor') && this._platform.is('mobile')) {
        this.isMobile = true;
      }
    });

    this.otp = this._activeRouter.snapshot.params.otp;
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

  async ionViewWillEnter() {
    this.content.scrollToPoint(0, this.scrollPosition);

    if (this.authService.isLogged) {
      this._router.navigate(['/']);
      return null;
    }

    if (this.otp === ':otp') {
      this.otp = null;
    }

    this._initForm();

    if (this.otp) {
      this.loadInvitation();
    }
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 25);
  }

  async _initForm() {
    this.registerForm = this._formService.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, CustomValidator.emailValidator]],
      password: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(30)]]
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
      this._router.navigate(['landing']);
  }

  /**
   * Update model from form values
   */
  updateModelFormValues() {
    this.model = new Contact();
    this.model.contact_name = this.registerForm.value.name;
    this.model.contact_email = this.registerForm.value.email;
    this.model.contact_password_hash = this.registerForm.value.password;
  }

  /**
   * Submit form to register agent
   */
  registerSubmit() {

    if (this.registerForm.valid) {
      this.isLoading = true;

      this.updateModelFormValues();

      this.createAccountSubscription = this.authService.createAccount(this.model, this.otp).subscribe(res => {

          this.isLoading = false;

          if (res.operation === 'success' && res.token) {
              this.authService.setAccessToken(res, true);
          } else if (res.operation === 'error') {
              this._alertCtrl.create({
                message: res.message,
                buttons: ['Ok']
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
   * Open login page
   */
  openLoginPage() {
    this._router.navigate(['login']);
  }
}
