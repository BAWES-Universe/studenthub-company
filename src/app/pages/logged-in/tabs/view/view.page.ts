import { Component, OnInit, ViewChild } from '@angular/core';
import {IonTabs, Platform, MenuController, AlertController} from '@ionic/angular';
import { Router } from '@angular/router';
import {EventService} from 'src/app/providers/event.service';
import {AuthService} from 'src/app/providers/auth.service';

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

  constructor(
      public platform: Platform,
      public menuCtrl: MenuController,
      public router: Router,
      public eventService: EventService,
      public auth: AuthService,
      public alertCtrl: AlertController
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

  logout() {
    console.log('logout');
    this.auth.logout();
  }

  link() {
    console.log('link');
  }
}
