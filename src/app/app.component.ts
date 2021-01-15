import { Component, OnInit, ApplicationRef } from '@angular/core';
import { AlertController, MenuController, NavController, Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { SwUpdate } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
import { first } from 'rxjs/operators';
import { interval, concat } from 'rxjs';
// services
import { AuthService } from './providers/auth.service';
import { EventService } from './providers/event.service';
import { CandidateService } from './providers/logged-in/candidate.service';
import { AwsService } from './providers/aws.service';
import { CompanyService } from './providers/logged-in/company.service';


const { SplashScreen } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  public selectedIndex;
  public totalEmployees;

  public updatesAvailable = false;

  constructor(
    public updates: SwUpdate,
    public appRef: ApplicationRef,
    private platform: Platform,
    public auth: AuthService,
    public eventService: EventService,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public _menuCtrl: MenuController,
    public awsService: AwsService,
    public companyService: CompanyService,
    public candidateService: CandidateService
  ) {
    this.initializeApp();
    // this.loadTotalEmployee();
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

    if (this.auth.isLogged) {
      this.loadTotalEmployee();
      this.loadCompanies();
    }
  }

  logout() {
    this.auth.logout();
  }

  eventSub() {

    // Check for network connection
    this.eventService.internetOffline$.subscribe(async () => {
      const alert = await this.alertCtrl.create({
        header: 'No Internet Connection',
        subHeader: 'Sorry, no Internet connectivity detected. Please reconnect and try again.',
        buttons: ['Dismiss']
      });
      alert.present();
      this.navCtrl.navigateRoot(['/no-internet']);
    });

    this.eventService.totalEmployee$.subscribe(userEventData => {
      this.totalEmployees = userEventData;
    });

    // On Login Event, set root to Internal app page
    this.eventService.userLogined$.subscribe(userEventData => {
      this.loadCompanies();
      
      this.navCtrl.navigateRoot(['/']);
    });

    this.eventService.error500$.subscribe(userEventData => {
      this.navCtrl.navigateRoot(['/server-error']);
    });

    this.eventService.error404$.subscribe(userEventData => {
      this.navCtrl.navigateRoot(['/not-found']);
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
   * load companies list
   */
  async loadCompanies() {
    
    this.companyService.list().subscribe(response => {

      this.auth.companies = response;

      /*if (this.auth.companies.length > 0 && !this.oneSignalIncluded) {

        this._storage.get('oneSignalStatus').then(status => {
          if (status !== 2) {
            this.oneSignalIncluded = true;
            this._includeOneSignalJs();
          }
        });
      }*/

      if (this.auth.companies.length && this.auth.company_id) {

        const found = this.auth.companies.find((data, key) => {
          if (data.company_id == this.auth.company_id) {
            return true;
          }
        });

        if (!found) {
          if (this.auth.companies[0]) {
            this.eventService.companyChanged$.next({
              employer: this.auth.companies[0]
            });
          } else {
            this.eventService.companyChanged$.next({ employer: null });
          }
        }
      }
    });
    /*
    // load invitation pending to accept

    this._invitationService.pending().subscribe(response => {
      this.auth.invitations = response;
    });

    // list EmployerAccessRequest

    this.requestService.list().subscribe(response => {
      this.auth.employerAccessRequest = response;
    });*/
  }

  /**
   * change company request
   * @param employer
   */
  changeCompany(employer) {
   
    this._menuCtrl.close();

    this.resetCompanyDetail(employer);

    if (employer) {
      this.navCtrl.navigateRoot(['/']);
    }

    this.eventService.companyChanged$.next({
      'employer': employer
    });
  }

  /**
   * reset company detail
   */
  async resetCompanyDetail(employer) {
    this.auth.setEmployer(employer);

    /*clearInterval(this.alertSubscription);

    this.alertSubscription = null;

    if (employer) {
      this.alertSubscribe();
    }*/
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
        const updateInterval$ = interval(60 * 1000); // every minute
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
