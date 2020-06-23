import { Component, OnInit } from '@angular/core';

import {AlertController, NavController, Platform} from '@ionic/angular';
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
    public navCtrl:NavController,
    public _alertCtrl:AlertController
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

  async ngOnInit() {

    // Check for network connection
    this.eventService.internetOffline$.subscribe(async () => {
      let alert = await this._alertCtrl.create({
        header: 'No Internet Connection',
        subHeader: 'Sorry, no Internet connectivity detected. Please reconnect and try again.',
        buttons: ['Dismiss']
      });
      alert.present();
    });

    // On Login Event, set root to Internal app page
    this.eventService.userLogined$.subscribe(userEventData => {
      this.navCtrl.navigateRoot(['/']);
    });

    // On Logout Event, set root to Login Page
    this.eventService.userLoggedOut$.subscribe((logoutReason) => {
      // Set root to Login Page
      this.navCtrl.navigateRoot(['/login']);

      // Show Message explaining logout reason if there's one set
      if (logoutReason) {
        console.log(logoutReason);
        console.log('Invalid Access');
      }
    });
  }

  logout(){
    this.auth.logout();
  }

  eventSub() {

  }
}
