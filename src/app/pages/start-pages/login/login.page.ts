import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { CustomValidator } from '../../../validators/custom.validator';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
// Service
import { AuthService } from 'src/app/providers/auth.service';
import { EventService } from 'src/app/providers/event.service';
import { TranslateLabelService } from "../../../providers/translate-label.service";


const { Storage } = Plugins;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public loginForm: FormGroup;

  // Disable submit button if loading response
  public isLoading = false;

  // Store old email and password to make sure user won't make same mistake twice
  public oldEmailInput = '';
  public oldPasswordInput = '';

  // Store number of invalid password attempts to suggest reset password
  private _numberOfLoginAttempts = 0;
  public type = 'password';

  public showPass = false;

  constructor(
    public navCtrl: NavController,
    private _fb: FormBuilder,
    private _auth: AuthService,
    private _alertCtrl: AlertController,
    private eventService: EventService,
    private router: Router,
    public translateService: TranslateLabelService
  ) {
  }

  ngOnInit() {
    // Initialize the Login Form
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, CustomValidator.emailValidator]],
      password: ['', Validators.required]
    });
  }

  /**
   * Attempts to login with the provided email and password
   */
  onSubmit() {
    this.isLoading = true;

    const email = this.oldEmailInput = this.loginForm.value.email;
    const password = this.oldPasswordInput = this.loginForm.value.password;

    this._auth.basicAuth(email, password).subscribe(res => {

      this.isLoading = false;

      if (res.operation == 'success') {
        // Successfully logged in, set the access token within AuthService
        this._auth.setAccessToken(res);

      } else if (res.operation == 'error' && res.errorType == 'email-not-verified') {

        Storage.set({ 'key': "unVerifiedToken", "value": JSON.stringify(res.unVerifiedToken) }).catch(r => {
          this.eventService.errorStorage$.next();
        });

        this.router.navigate([
          'verify-email',
          res['unVerifiedToken']['email']
        ]);

      } else {

        this.alertMsg(
          'Unable to Log In',
          res.message,
          'Okay'
        );
      }

    }, err => {
      this.isLoading = false;

      // Incorrect email or password
      if (err.status == 401) {
        this._numberOfLoginAttempts++;

        // Check how many login attempts this user made, offer to reset password
        if (this._numberOfLoginAttempts > 2) {
          this.alertMsg(
            'Trouble Logging In?',
            "If you've forgotten your password, contact us to have it reset.",
            'Okay'
          );
        }
        else {
          this.alertMsg(
            'Invalid email or password',
            'The information entered is incorrect. Please try again.',
            'Try Again'
          );
        }
      } else {
        /**
         * Error not accounted for. Show Message
         */
        this.alertMsg(
          'Unable to Log In',
          'There seems to be an issue connecting to Payroll servers. Please contact us if the issue persists.',
          'Okay'
        );
      }
    });
  }

  /**
   * alert msg
   * @param header
   * @param msg
   * @param button
   */
  async alertMsg(header, msg, button) {
    const alert = await this._alertCtrl.create({
      header: this.translateService.transform(header),
      message: this.translateService.transform(msg),
      buttons: [this.translateService.transform(button)],
    });
    alert.present();
  }

  openRegisterPage() {
    this.router.navigate(['register']);
  }

  /**
   * reset password
   */
  resetPasswordRequest() {
    this.router.navigate(['forgot-password']);
  }

  showPassword() {
    this.showPass = !this.showPass;

    if (this.showPass) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

  changeLanguage(event) {
    const lang = this.translateService.currentLang == 'ar' ? 'en' : 'ar';
    this.eventService.setLanguagePref$.next(lang);
  }
}
