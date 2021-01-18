import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController, IonNav, IonContent } from '@ionic/angular';
//services
import { TranslateLabelService } from '../../../../../services/translate-label.service';
import { InvitationFormPage } from '../invitation-form/invitation-form.page';


@Component({
  selector: 'pogi-invitation-permission',
  templateUrl: './invitation-permission.page.html',
  styleUrls: ['./invitation-permission.page.scss'],
})
export class InvitationPermissionPage {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public scrollPosition: number = 0;

  public role; 

  public borderLimit: boolean = false; 
  
  constructor(
    public router: Router,
    public nav: IonNav,
    public modalCtrl: ModalController,
    public translateLabel: TranslateLabelService
  ) { }

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

  dismiss() {
    this.modalCtrl.dismiss();
  }

  setRole(role) {     
    this.role = role;//to show selected option on backward navigation 
    this.nav.push(InvitationFormPage, { role: role });
  }
}
