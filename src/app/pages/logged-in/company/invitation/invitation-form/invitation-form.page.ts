import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, AlertController, IonContent } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
//form
import { CustomValidator } from '../../../../../validators/custom.validator';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
//services
import { TranslateLabelService } from '../../../../../services/translate-label.service';
import { AuthService } from '../../../../../services/auth.service';
import { InvitationService } from '../../../../../services/logged-in/invitation.service';


@Component({
  selector: 'pogi-invitation-form',
  templateUrl: './invitation-form.page.html',
  styleUrls: ['./invitation-form.page.scss'],
})
export class InvitationFormPage implements OnInit {
  
  @ViewChild(IonContent, { static: true }) content: IonContent;

  public scrollPosition: number = 0;

  public loading: boolean = false; 

  public form: FormGroup;

  public role: number; 
  
  public inviteSubscription: Subscription;

  public borderLimit: boolean = false;

  constructor(
    public route: ActivatedRoute,
    private _fb: FormBuilder,
    public alertCtrl: AlertController, 
    public modalCtrl: ModalController,
    public invitationService: InvitationService,
    public authService: AuthService,
    public translateLabel: TranslateLabelService
  ) { }

  ngOnInit() {
    this.initForm();
  }
  
  async initForm() {  
    this.form = this._fb.group({
      email_to_invite: ['', [Validators.required, CustomValidator.emailValidator]],
      role: [this.role, Validators.required]
    });
  }

  ionViewWillLeave() {  
    this.content.getScrollElement().then(ele => {
      this.scrollPosition = ele.scrollTop;
    }); 
  }

  ionViewDidEnter() {
    this.content.scrollToPoint(0, this.scrollPosition);  
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 25) ?  true : false;
  }

  submitForm() {
    
    this.loading = true;

    const params = {
      email_to_invite: this.form.value.email_to_invite,
      role: this.form.value.role,
      employer_uuid: this.authService.employer_uuid
    };

    this.inviteSubscription = this.invitationService.invite(params).subscribe(response => {
    
      this.inviteSubscription.unsubscribe();

      this.loading = false;

      if (response.operation == 'success') {
        this.modalCtrl.dismiss({ refresh: true }); 
      } else {
        this._handleError(response);
      }
    }, () => {
      this.loading = false;
    });
  }

  /**
   * Process error message in API response
   * @param response
   */
  _handleError(response) {
    const TryLbl = this.translateLabel.transform('Try Again');

    this.alertCtrl.create({
      message: this.translateLabel.errorMessage(response.message),
      buttons: [TryLbl],
    }).then(alert => {
      alert.present();
    });
  }
}
