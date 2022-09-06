import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// service
import { AccountService } from 'src/app/providers/logged-in/account.service';
import {TranslateLabelService} from "../../../providers/translate-label.service";


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  public oldPassword = '';
  public newPassword = '';
  public loading = false;
  public passwordForm: FormGroup;

  // Disable submit button if loading response
  public isLoading = false;

  public oldType: string = 'password';

  public type: string = 'password';

  public borderLimit;

  constructor(
    private _fb: FormBuilder,
    public accountService: AccountService,
    private _alertCtrl: AlertController,
    private translateService: TranslateLabelService
  ) {
  }

  ngOnInit() {
    window.analytics.page('Change Password Page');

    // Initialize the Login Form
    this.passwordForm = this._fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required]
    });
  }

  toggleOldPasswordVisibility() {
    this.oldType = this.oldType == 'password' ? 'text' : 'password';
  }

  togglePasswordVisibility() {
    this.type = this.type == 'password' ? 'text' : 'password';
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  /**
   * Attempts to login with the provided email and password
   */
  async save() {
    if (!this.passwordForm.valid) {
      return false;
    }

    this.loading = true;

    const oldP = this.passwordForm.value.oldPassword;
    const newP = this.passwordForm.value.newPassword;

    this.accountService.changePassword(oldP, newP).subscribe(async res => {

      this.loading = false;

      if (res.operation == 'success') {

        const alert = await this._alertCtrl.create({
          header: this.translateService.transform('Success'),
          message: res.message,
          buttons: [this.translateService.transform('Okay')],
        });
        alert.present();
        this.passwordForm.reset();

      } else if (res.operation == 'error') {

        const alert = await this._alertCtrl.create({
          header: this.translateService.transform('Error'),
          message: res.message,
          buttons: [this.translateService.transform('Okay')],
        });
        alert.present();
      }
    });
  }
}
