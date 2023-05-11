import { Component, OnInit, ViewChild } from '@angular/core';
import {IonTabs, Platform, MenuController, AlertController} from '@ionic/angular';
import { Router } from '@angular/router';
import {EventService} from 'src/app/providers/event.service';
import {AuthService} from 'src/app/providers/auth.service';
import {TranslateLabelService} from "../../../../providers/translate-label.service";

@Component({
  selector: 'student-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
// @PreLoad('SourceBrowserPage')
export class ViewPage implements OnInit {

  applicationCount: number = null;
  conversationAlert: number = null;

  @ViewChild(IonTabs, { static: true }) tabRef: IonTabs;

  @ViewChild('menuLTR', { static: false }) menuLTR;
  @ViewChild('menuRTL', { static: false }) menuRTL;

  constructor(
      public platform: Platform,
      public menuCtrl: MenuController,
      public router: Router,
      public eventService: EventService,
      public auth: AuthService,
      public alertCtrl: AlertController,
      public translationService: TranslateLabelService
  ) {
    this.eventSubscriptions();
  }

  ngOnInit() {
  }

  eventSubscriptions() {

  }

  ionViewWillEnter() {
    this.eventService.pageSelected$.next('view');
  }

  ionViewDidEnter() { 
    if(this.auth.company && this.auth.company.company_status_override == 9) { 
      this.router.navigate(['under-review']);
    }
  }

  logout() {
    this.auth.logout();
  }
}
