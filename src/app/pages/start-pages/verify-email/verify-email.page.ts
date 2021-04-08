import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, ToastController, AlertController, Platform, IonContent, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Capacitor, Plugins } from '@capacitor/core';
// services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { EventService } from 'src/app/providers/event.service';
import { AuthService } from 'src/app/providers/auth.service';
import { AccountService } from 'src/app/providers/logged-in/account.service';
// models
import { Contact } from 'src/app/models/contact';


const { Keyboard, KeyboardInfo } = Plugins;
const { Storage } = Plugins;

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  @ViewChild('ic1', { static: false }) ic1;
  @ViewChild('ic2', { static: false }) ic2;
  @ViewChild('ic3', { static: false }) ic3;
  @ViewChild('ic4', { static: false }) ic4;

  public scrollPosition: number = 0;

  code: string;

  c1: string;
  c2: string;
  c3: string;
  c4: string;

  countDown;
  counter;
  tick;

  email: string;
  unVerifiedToken: any;

  public loader = false;

  public emailVerifiedSubscription;

  public timeIntervalToVerify = 5 * 1000;

  public timeElapsedToVerify = 0;

  public timeoutToVerify = 5 * 60 * 1000;//5 min in milliseconds 

  public isVerified = false;

  public keyboardIsVisible: boolean = false;

  public isAlreadyVerifiedSubscription: Subscription;
  public updateEmailSubscription: Subscription;
  public verifyEmailSubscription: Subscription;
  public resendEmailSubscription: Subscription;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public navCtrl: NavController,
    public translateService: TranslateLabelService,
    public authService: AuthService,
    public accountService: AccountService,
    public eventService: EventService, 
    public _loadingCtrl: LoadingController,
    public _toastCtrl: ToastController,
    public _alertCtrl: AlertController,
    public platform: Platform
  ) {
  }

  ngOnInit() {
    // if (!this.authService.isLogged) {
    //  this.router.navigate(['view']);
    // }

    // Keyboard Plugin Events

    if (this.platform.is('capacitor')) {
      Keyboard.addListener('keyboardWillShow', info => {
        this.keyboardIsVisible = true;
      });

      Keyboard.addListener('keyboardDidHide', () => {
        this.keyboardIsVisible = false;
      });
    }
  }

  clearVerifySubscription() {

    if (this.emailVerifiedSubscription)
      clearInterval(this.emailVerifiedSubscription);

    this.emailVerifiedSubscription = null;
  }

  ngOnDestroy() {
    if (!!this.isAlreadyVerifiedSubscription) {
      this.isAlreadyVerifiedSubscription.unsubscribe();
    }

    if (!!this.updateEmailSubscription) {
      this.updateEmailSubscription.unsubscribe();
    }

    if (!!this.verifyEmailSubscription) {
      this.verifyEmailSubscription.unsubscribe();
    }

    if (!!this.resendEmailSubscription) {
      this.resendEmailSubscription.unsubscribe();
    }

    this.clearVerifySubscription();
  }

  ionViewWillLeave() {
    this.content.getScrollElement().then(ele => {
      this.scrollPosition = ele.scrollTop;
    });

    this.clearVerifySubscription();
  }

  ionViewDidEnter() {
    this.content.scrollToPoint(0, this.scrollPosition);

    this.email = this.route.snapshot.paramMap.get('email');
    this.code = this.route.snapshot.paramMap.get('code');

    if (this.code && this.code != ':code') {

      setTimeout(() => {

        this.ic1.value = this.code[0];
        this.ic2.value = this.code[1];
        this.ic3.value = this.code[2];
        this.ic4.value = this.code[3];

        this.verify();
      });
    }

    setTimeout(() => {
      if (this.ic1)
        this.ic1.setFocus();
    }, 50);


    Storage.get({ key: 'unVerifiedToken' }).then(ret => {
      const data = JSON.parse(ret.value);

      if (!data) {
        return null;
      }

      this.unVerifiedToken = data.token;

      this.emailVerifiedSubscription = setInterval(() => {

        this.timeElapsedToVerify += this.timeIntervalToVerify;

        if (this.timeElapsedToVerify >= this.timeoutToVerify) {
          this.clearVerifySubscription();
          return this.navCtrl.navigateRoot(['/']);
        }

        this.isAlreadyVerified(data);
      }, 5 * 1000);
    }).catch(r => {
      this.eventService.errorStorage$.next();
    });
  }

  /**
   * on input change focus on next input
   * @param event
   * @param nextInp
   * @param prevInp
   */
  onChange(event, nextInp = null, prevInp = null) {

    //if(!this.ic1.value || !this.ic2.value || !this.ic3.value || !this.ic4.value)
    //  return true;

    if (event.target.value && event.target.value.length > 0 && nextInp) {
      nextInp.setFocus();
    }

    //if got all values submit 

    this.code = this.ic1.value + this.ic2.value + this.ic3.value + this.ic4.value;

    //if not comming from email link with verification code 

    if (
      !this.route.snapshot.paramMap.get('code') &&
      this.code &&
      this.code.length == 4
    ) {
      this.verify();
    }

    // if back key pressed

    // if(event.value.length == 0 && prevInp)  {
    //     prevInp.setFocus();
    // }
  }

  /**
   * On focus clear input
   * @param event
   * @param code
   */
  onFocus(event, code) {
    code = '';
    // event.stopPropagation();
  }

  /**
   * Check if email already verified
   * @param res
   */
  isAlreadyVerified(res) {

    this.isAlreadyVerifiedSubscription = this.authService.isAlreadyVerified(res).subscribe(response => {

      if (response.status == 1) {
        this.onSuccess(res);
      }
    });
  }

  /**
   * on successfull verification
   * @param res
   */
  async onSuccess(res) {

    if (Capacitor.platform !== 'web') {
      Plugins.Keyboard.hide();
    }

    // don't call twise

    if (this.isVerified) {
      return null;
    }

    this.isVerified = true;

    clearInterval(this.emailVerifiedSubscription);

    Storage.remove({ key: 'unVerifiedToken' }).catch(r => {
      this.eventService.errorStorage$.next();
    });

    if (this.authService.isLogged) {

      this.eventService.profileUpdated$.next();//email updated

      this.router.navigate(['account']);

    // on sign up

    } else {
      this.authService.setAccessToken(res, true);
    }
  }

  /**
   * Update email address
   */
  async updateEmail() {

    const Cancel = this.translateService.transform('Cancel');
    const Submit = this.translateService.transform('Submit');
    const ChangeEmail = this.translateService.transform('Change Email');
    const NewEmail = this.translateService.transform('Enter New Email');

    const alert = await this._alertCtrl.create({
      header: ChangeEmail,
      inputs: [
        {
          name: 'newEmail',
          placeholder: NewEmail,
          type: 'email'
        }
      ],
      buttons: [
        {
          text: Cancel,
          role: 'cancel',
          handler: data => {
            return true;
          }
        },
        {
          text: Submit,
          handler: data => {
            return this.onUpdateEmailSubmit(data);
          }
        }
      ]
    });
    await alert.present();
  }

  /**
   * On update email submit event
   * @param data
   */
  async onUpdateEmailSubmit(data) {

    const loader = await this._loadingCtrl.create();
    await loader.present();

    let action;

    if (this.authService.isLogged) {
      const candidate = new Contact;
      candidate.contact_email = data.newEmail;
      action = this.accountService.updateEmail(candidate);

    } else {
      const params = {
        'unVerifiedToken': this.unVerifiedToken,
        'newEmail': data.newEmail
      };
      action = this.authService.updateEmail(params);
    }

    this.updateEmailSubscription = action.subscribe(async result => {

      loader.dismiss();

      if (result.operation == 'success') {

        this.email = data.newEmail;

        const toast = await this._toastCtrl.create({
          message: this.translateService.transform(result.message),
          duration: 3000,
        });
        await toast.present();

        return true;

      } else if (result.operation == 'error-session-expired') {

        const toast = await this._toastCtrl.create({
          message: this.translateService.transform('Session expired, please log back in.'),
          duration: 3000
        });
        await toast.present();

        this.logout('Session expired, please log back in.');

        return false;

      } else {

        const toast = await this._toastCtrl.create({
          message: this.translateService.errorMessage(result.message),
          duration: 3000
        });

        await toast.present();

        return false;
      }
    }, err => {
      loader.dismiss();
    });

    return false;
  }

  /**
   * Check code on value change
   */
  codeChange(c1, c2, c3, c4) {
    if (c1 && c2 && c3 && c4) {
      this.code = c1 + '' + c2 + '' + c3 + '' + c4;
      this.verify();
    }
  }

  submitOnEnter(event) {

    if (this.code && this.code.length == 4 && event.which == 13) {
      this.verify();
    }
  }

  /**
   * Verify verification code
   */
  verify() {

    this.loader = true;

    this.verifyEmailSubscription = this.authService.verifyEmail(this.email, this.code).subscribe(async res => {

      this.loader = false;

      if (this.isVerified) {
        return true;
      }

      if (res.operation == 'success') {
        this.onSuccess(res);
      } else {
        const alert = await this._alertCtrl.create({
          message: this.translateService.errorMessage(res.message),
          buttons: [this.translateService.transform('Okay')]
        });
        await alert.present();
      }
    }, err => {
      this.loader = false;
    });
  }

  /**
   * Request to resend verification mail
   */
  resendVerificationEmail() {
    const ok = this.translateService.transform('Okay');

    this.resendEmailSubscription = this.authService.resendVerificationEmail(this.email).subscribe(async res => {

      const alert = await this._alertCtrl.create({
        message: this.translateService.errorMessage(res.message),
        buttons: [ok]
      });
      await alert.present();

      if (
        res.operation != 'success' &&
        (
          res.errorCode == 1 || //if email already verified 
          res.errorCode == 3 // account not founnd 
        )
      ) {
        this.router.navigate(['view/home']);
      }
    });
  }

  /**
   * Logout
   */
  logout(reason) {
    this.authService.logout(reason, false);
  }
}
