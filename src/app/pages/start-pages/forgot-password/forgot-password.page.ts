import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AlertController, IonContent } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CustomValidator } from '../../../validators/custom.validator';
// services
import { AuthService } from '../../../providers/auth.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit, OnDestroy {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public scrollPosition: number = 0;

  resetForm: FormGroup;
  submitAttempt = false;

  public isLoading = false;

  public sendPasswordSubscription: Subscription;

  public borderLimit: boolean = false;

  constructor(
    public _fb: FormBuilder,
    public router: Router,
    public _authService: AuthService,
    public translateService: TranslateLabelService,
    public _alertCtrl: AlertController,
    public analyticService: AnalyticsService
  ) {
  }

  ngOnInit() {
    this.analyticService.page('Forgot Password Page');

    this.resetForm = this._fb.group({
      email: ['', [Validators.required, CustomValidator.emailValidator]],
    });
  }

  ngOnDestroy() {
    if (!!this.sendPasswordSubscription) {
      this.sendPasswordSubscription.unsubscribe();
    }
  }

  ionViewDidEnter() {
    this.content.scrollToPoint(0, this.scrollPosition);
  }

  ionViewWillLeave() {
    this.content.getScrollElement().then(ele => {
      this.scrollPosition = ele.scrollTop;
    });
  }

  /**
   * Request new password
   */
  async sendPassword() {

    this.submitAttempt = true;

    if (!this.resetForm.valid) {

      const alert = await this._alertCtrl.create({
        message: this.translateService.transform('Please enter valid email address'),
        buttons: [this.translateService.transform('Okay')]
      });
      await alert.present();

      return false;
    }

    this.isLoading = true;

    this.sendPasswordSubscription = this._authService.resetPasswordRequest(this.resetForm.value.email)
      .subscribe(async data => {

        if(data.operation == 'success') {
          const alert = await this._alertCtrl.create({
            message: data.message,
            buttons: [this.translateService.transform('Okay')]
          });
          await alert.present();
          this.loginPage();
        } else {
          const alert = await this._alertCtrl.create({
            message: this._authService.errorMessage(data.message),
            buttons: [this.translateService.transform('Okay')]
          });
          await alert.present();
        }

      },
      error => { },
      () => {
        this.isLoading = false;
      });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  /**
   * Open login page
   */
  loginPage() {
    this.router.navigate(['/login']);
  }
}
