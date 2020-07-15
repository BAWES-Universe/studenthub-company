import { Component, OnInit, ApplicationRef } from '@angular/core';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { SwUpdate } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
import { first } from 'rxjs/operators';
import { interval, concat } from 'rxjs';
//services
import { AuthService } from "./providers/auth.service";
import { EventService } from "./providers/event.service";
import {CandidateService} from "./providers/logged-in/candidate.service";


const { SplashScreen } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  public selectedIndex = 0;
  public totalEmployees = 0;

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


  public updatesAvailable: boolean = false;

  constructor(
    public updates: SwUpdate,
    public appRef: ApplicationRef,
    private platform: Platform,
    public auth: AuthService,
    public eventService: EventService,
    public navCtrl: NavController,
    public _alertCtrl: AlertController,
    public candidateService: CandidateService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {

      if (this.platform.is('hybrid')) {
        SplashScreen.hide();
      }

      this.setServiceWorker();
    });
  }

  async ngOnInit() {
    this.eventSub();
  }

  logout() {
    this.auth.logout();
  }

  eventSub() {

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

  /**
   * keep checking for service worker update
   */
  setServiceWorker() {

    // service worker watcher
    if (!this.platform.is('capacitor')) {

      if ('serviceWorker' in navigator && environment.serviceWorker && window.location.hostname != 'localhost') {

        navigator.serviceWorker.register('./ngsw-worker.js');

        // Allow the app to stabilize first, before starting polling for updates with `interval()`.
        const appIsStable$ = this.appRef.isStable.pipe(first(isStable => isStable === true));
        const updateInterval$ = interval(60 * 1000);// every minute
        const updateIntervalOnceAppIsStable$ = concat(appIsStable$, updateInterval$);

        updateIntervalOnceAppIsStable$.subscribe(() => {
          this.updates.checkForUpdate().then((e) => {
          });
        });

        this.updates.available.subscribe((e) => {
          this.updatesAvailable = true;
        });

        this.updates.activated.subscribe((e) => {
          this.updatesAvailable = false;
        }, reason => {
          console.error('service worker update activation failed', reason);
        });
      }
    }
  }

  /**
   * When user select refresh on udpate available prompt
   */
  onUpdateAlertRefresh() {

    if (!this.updatesAvailable) {
      return this.updatesAvailable = false;
    }

    try {
      this.updates.activateUpdate().then(() => {
      });
    } catch {
    }

    window.location.reload();
  }

  /**
   * When user select close on udpate available prompt
   */
  onUpdateAlertClose() {
    this.updatesAvailable = false;
  }

  loadTotalEmployee() {
    this.candidateService.total().subscribe(result => {
      this.totalEmployees = result;
    });
  }
}
