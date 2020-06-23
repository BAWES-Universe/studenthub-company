import { Component, OnInit } from '@angular/core';

import {NavController, Platform} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {AuthService} from "./providers/auth.service";
import {EventService} from "./providers/event.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Company',
      url: '/company-list',
      icon: 'mail'
    },
    {
      title: 'Store',
      url: '/store-list',
      icon: 'list'
    },
    {
      title: 'Candidate',
      url: '/candidate-list',
      icon: 'person'
    },
    {
      title: 'Transfer',
      url: '/transfer-list',
      icon: 'repeat'
    },
    {
      title: 'Change Password',
      url: '/change-password',
      icon: 'key'
    }
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public auth:AuthService,
    public eventService: EventService,
    public navCtrl:NavController
  ) {
    this.initializeApp();
    this.eventSub();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    // const path = window.location.pathname.split('folder/')[1];
    // if (path !== undefined) {
    //   this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    // }
  }

  logout(){
    this.auth.logout();
  }

  eventSub() {
    this.eventService.userLogined$.subscribe((reason) => {
      this.navCtrl.navigateRoot('company-list');
    });

    this.eventService.userLoggedOut$.subscribe((reason) => {
      this.navCtrl.navigateRoot('login');
    });
  }
}
