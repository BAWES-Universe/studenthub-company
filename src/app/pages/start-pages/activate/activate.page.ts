import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
//services
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { CompanyService } from 'src/app/providers/logged-in/company.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AuthService } from 'src/app/providers/auth.service';


@Component({
  selector: 'app-activate',
  templateUrl: './activate.page.html',
  styleUrls: ['./activate.page.scss'],
})
export class ActivatePage implements OnInit {

  public type = 'password';

  public form: FormGroup;

  public borderLimit;
  
  // Disable submit button if loading response
  public isLoading = false;

  constructor(
    public navCtrl: NavController, 
    public alertCtrl: AlertController, 
    public activatedRoute: ActivatedRoute,
    private _fb: FormBuilder,
    public authService: AuthService,
    public translateService: TranslateLabelService,
    public analyticService: AnalyticsService,
    public companyService: CompanyService
  ) { }

  ngOnInit() {
    this.analyticService.page('Company activate Page');
 
    this.initForm();
  }

  initForm() {
  
    this.form = this._fb.group({
      contact_auth_key: [this.activatedRoute.snapshot.paramMap.get('contact_auth_key'), Validators.required],
      contact_email: [this.activatedRoute.snapshot.paramMap.get('contact_email'), Validators.required],
      password: ['', Validators.required],
      company_id: [this.activatedRoute.snapshot.paramMap.get('company_id'), Validators.required],
      company_logo: [''], 
      commercial_licence: ['', Validators.required],
      description: [''],
      website: ['']
    });
  }

  /**
   * Attempts to login with the provided email and password
   */
  async onSubmit() {

    if (!this.form.valid) {
      return false;
    }

    this.isLoading = true;

    this.companyService.activate(this.form.value).subscribe(async res => {

      this.isLoading = false;

      if (res.operation === 'success') {

        /*const alert = await this.alertCtrl.create({
          header: this.translateService.transform('Success'),
          message: this.translateService.errorMessage(res.message),
          buttons: [this.translateService.transform('Okay')],
        });
        alert.present();*/

        this.form.reset();

        this.authService.setAccessToken(res.accessToken);

        //this.navCtrl.navigateRoot(['/']);

      } else if (res.operation === 'error') {

        const alert = await this.alertCtrl.create({
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
    this.type = this.type === 'password'? 'text': 'password';
  }
}
