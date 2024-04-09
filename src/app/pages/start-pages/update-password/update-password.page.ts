import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavController, AlertController, IonInput, ModalController, Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
// services
import { AuthService } from 'src/app/providers/auth.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.page.html',
  styleUrls: ['./update-password.page.scss'],
})
export class UpdatePasswordPage {

  public type = 'password';

  public token;

  public newPassword = '';

  public passwordForm: FormGroup;

  public borderLimit;
  
  // Disable submit button if loading response
  public isLoading = false;

  @ViewChild('inptPassword', { static: false }) inptPassword: IonInput;

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public activatedRoute: ActivatedRoute,
    private _fb: FormBuilder,
    public translateService: TranslateLabelService,
    public analyticService: AnalyticsService,
    public authService: AuthService,
    private _alertCtrl: AlertController
  ) {
  }

  ngOnInit() {
    this.analyticService.page('Update Password Page');

    this.token = this.activatedRoute.snapshot.paramMap.get('token');

    // Initialize the Login Form
    this.passwordForm = this._fb.group({
      newPassword: ['', Validators.required]
    });

    setTimeout(() => {
      if(this.inptPassword)
        this.inptPassword.setFocus();
    }, 800);
  }

  ionViewWillLeave() {
    this.analyticService.track('page_exit', {
      'page': 'Update Password Page'
    });  
  }

  /**
   * close page
   */
  dismiss() {
    this.navCtrl.navigateRoot('/login');
  }

  /**
   * Attempts to login with the provided email and password
   */
  async save() {

    if (!this.passwordForm.valid) {
      return false;
    }

    this.isLoading = true;

    this.authService.changePassword(this.passwordForm.value.newPassword, this.token).subscribe(async res => {

      this.isLoading = false;

      if (res.operation == 'success') {

        const alert = await this._alertCtrl.create({
          header: this.translateService.transform('Success'),
          message: this.translateService.errorMessage(res.message),
          buttons: [this.translateService.transform('Okay')],
        });
        alert.present();

        this.passwordForm.reset();

        // this.authService.setAccessToken(res.accessToken);

        this.navCtrl.navigateRoot(['/']);

      } else if (res.operation == 'error') {

        const alert = await this._alertCtrl.create({
          header: this.translateService.transform('Error'),
          message: this.translateService.errorMessage(res.message),
          buttons: [this.translateService.transform('Okay')],
        });
        alert.present();
      }
    }, () => {
      this.isLoading = false;
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  /**
   * toggle password visibility
   */
  showPassword() {
    this.type = this.type == 'password'? 'text': 'password';
  }
}
