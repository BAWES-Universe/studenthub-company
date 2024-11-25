import { Component, OnInit, ApplicationRef, OnDestroy, Inject, NgZone } from '@angular/core';
import { AlertController, MenuController, NavController, Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { SwUpdate } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
import { first } from 'rxjs/operators';
import { interval, concat } from 'rxjs';
import { Browser } from '@capacitor/browser';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { DOCUMENT } from '@angular/common';
import {Router} from "@angular/router";
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
// services
import { AuthService } from './providers/auth.service';
import { EventService } from './providers/event.service';
import { CandidateService } from './providers/logged-in/candidate.service';
import { AwsService } from './providers/aws.service';
import { CompanyService } from './providers/logged-in/company.service';
import {CompanyRequestService} from "./providers/logged-in/company-request.service";
import {TranslateLabelService} from "./providers/translate-label.service";
import {LanguageService} from "./providers/language.service";
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { AnalyticsService } from './providers/analytics.service';
import { Preferences } from '@capacitor/preferences';
import { CurrencyService } from './providers/currency.service';
import { CampaignService } from './providers/campaign.service';
import { ChatService } from './providers/logged-in/chat.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  public selectedIndex;
  public totalEmployees;

  public updatesAvailable = false;
  public subscribeForRequest;

  public alertSubscription;

  constructor(
    public zone: NgZone,
    public updates: SwUpdate,
    public appRef: ApplicationRef,
    private platform: Platform,
    public auth: AuthService,
    public eventService: EventService,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public _menuCtrl: MenuController,
    public awsService: AwsService,
    public companyService: CompanyService,
    public candidateService: CandidateService,
    public requestService: CompanyRequestService,
    public router: Router,
    public currencyService: CurrencyService,
    public translateService: TranslateLabelService,
    public languageService: LanguageService,
    public analyticsService: AnalyticsService,
    public campaignService: CampaignService,
    public chatService: ChatService,
    public auth0: Auth0Service,
    @Inject(DOCUMENT) public document: Document,
  ) {
    this.initializeApp();
    // this.loadTotalEmployee();
  }

  initializeApp() {

    // use hook after platform dom ready
    GoogleAuth.initialize({
      clientId: "123188361193-ijgbu581g8sp4qag6gt4nia3410160qk.apps.googleusercontent.com",
      scopes: ['profile', 'email'],
      grantOfflineAccess: false,
    });
    
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    
    if(urlParams.get('auth_key')) {
      this.auth.loginByKey(urlParams.get('auth_key'));
    }

    if(urlParams.get('utm_id')) {
      this.auth.utm_uuid = urlParams.get('utm_id');
      Preferences.set({ key: 'utm_uuid', value: this.auth.utm_uuid });
      
      this.campaignService.click(this.auth.utm_uuid).subscribe();

      //this.cookieService.set('utm_uuid', this.authService.utm_uuid, )
      window.localStorage.setItem("utm_uuid", this.auth.utm_uuid);

      this.analyticsService.track("From Campaign", {
        "utm_id": this.auth.utm_uuid,
        "utm_source": urlParams.get('utm_source'),
        "utm_medium": urlParams.get('utm_medium'),
        "utm_campaign": urlParams.get('utm_campaign'),
        "utm_term": urlParams.get('utm_term'),
        "utm_content": urlParams.get('utm_content'),
      });
    }

     // Use Capacitor's App plugin to subscribe to the `appUrlOpen` event
     App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      // Must run inside an NgZone for Angular to pick up the changes
      // https://capacitorjs.com/docs/guides/angular
      this.zone.run(() => {
        //if (url?.startsWith(this.callbackUri)) {
          // If the URL is an authentication callback URL..
          if (
            event.url.includes('state=') &&
            (event.url.includes('error=') || event.url.includes('code='))
          ) {
            // Call handleRedirectCallback and close the browser
            this.auth0
              .handleRedirectCallback(event.url)
              //.pipe(mergeMap(() => Browser.close()))
              .subscribe();
          } else {
            const slug = event.url.split(".co").pop();

            if (slug) {
              this.router.navigateByUrl(slug);
            }
            
            //Browser.close();
          }
        //}
      });
    });

    this.platform.ready().then(() => {

      //in case login event not getting fired 
      if (this.auth.isLogged) {
        this._updateAlert();
        this.alertSubscribe();
      }

      this.loadCurrencies();

      if (!this.auth.currentLocation) { 
        this.auth.locate().subscribe(res => {
          
          this.auth.currentLocation = res; 

          Preferences.set({ key: 'currentLocation', value: JSON.stringify(res) });

          this.eventService.locationUpdated$.next(res);
        });
      }

      if (this.platform.is('hybrid')) {
        SplashScreen.hide();
      }

      this.setServiceWorker();
      
      /**
       * when user comming back from auth0
       */
       this.auth0.isAuthenticated$.subscribe(isAuthenticated => {
        
        if(!isAuthenticated || this.auth.isLogged) return null;
      
        //this.auth.idTokenClaims$.subscribe(r => {
        this.auth0.getAccessTokenSilently().subscribe(r => {  
          this.auth.useTokenForAuth(r).then();
        });
      });
    });
  }

  async ngOnInit() {

    if (this.auth.isLogged) {
      this.loadTotalEmployee();
      this.loadCompanies();

      /*if (!this.auth.company && this.auth.company_id) {
        this.loadCompanyDetail();
      }*/
    }

    this.subscribeToEvents();
  }

  loadCurrencies() {
    this.currencyService.list(-1).subscribe(data => {
      this.auth.currencies = data.body;
    });
  }

  logout() {
    this.auth.logout();
  }

  ngOnDestroy() {

    if (this.subscribeForRequest) {
      clearInterval(this.subscribeForRequest);
      this.subscribeForRequest = null;
    }
  }

  /**
   * check for request count
   */
  checkRequestCount() {
    this.requestService.requestCount().subscribe(data => {
      if (parseInt(data.active_request_count) != parseInt(this.auth.active_request_count)) {
        this.auth.setActiveRequest(data.active_request_count);
      }
    });
  }

  /**
   * subscribe to events
   */
  subscribeToEvents() {

    if(this.auth.isLogged && !this.subscribeForRequest) {
      this.subscribeForRequest = setInterval(data => {
        this.checkRequestCount();
      }, 10000);
    }

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

    this.eventService.errorStorage$.subscribe(() => {
      this.navCtrl.navigateForward(['app-error']);
    });

    /**
     * Update alert count
     */
    this.eventService.alertUpdate$.subscribe(() => {
      this._updateAlert();
    });

    // On Login Event, set root to Internal app page
    this.eventService.userLogined$.subscribe(userEventData => {
 
      this._updateAlert();

      this.alertSubscribe();

      this.analyticsService.user(this.auth.id, {
        name: this.auth.profile_name,
        email: this.auth.email,
        company_id: this.auth.company_id
      });
  
      if(!this.subscribeForRequest) {
        this.subscribeForRequest = setInterval(data => {
          this.checkRequestCount();
        }, 10000);
      }

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

      console.log('logout');

      if (this.alertSubscription) {
        clearInterval(this.alertSubscription);
        this.alertSubscription = null;
      }

      if (this.subscribeForRequest) {
        clearInterval(this.subscribeForRequest);
        this.subscribeForRequest = null;
      }

      // Set root to Login Page
      this.navCtrl.navigateRoot(['/login']);
 
      this.auth0.isAuthenticated$.subscribe(isAuthenticated => {
        if(isAuthenticated) {
          this.auth0.logout({ returnTo: document.location.origin });
        }
      });

      // Show Message explaining logout reason if there's one set
      if (logoutReason) {
        console.log(logoutReason);
      }
    });

    this.eventService.companyChanged$.subscribe(userEventData => {
      this.loadTotalEmployee();
    });

    /**
     * Save user language preference after login
     */
    this.eventService.setLanguagePref$.subscribe(language_pref => {

      /**
       * changing status on `side` property change
       * https://github.com/ionic-team/ionic/blob/master/core/src/components/menu/menu.tsx
       *
       if (language_pref == 'ar') {
        this.menuRTL.side = 'end';//changing english to arabic
      } else {
        this.menuLTR.side = 'end';//changing arabic to english
      }*/

      this.languageService.listToTranslate().subscribe(languages => {

        for (const element of languages) {
          if (element.code == language_pref) {

            // change language

            this.translateTo(element);

            break;
          }
        }
      });
    });

  }

  loadCompanyDetail() {

    if (!this.auth.company_id) {
      return this.auth.setEmployer(null);
    }

    this.companyService.view(this.auth.company_id).subscribe(response => {
      this.auth.setEmployer(response);
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
        }).catch(r => {
          this.eventService.errorStorage$.next();
        });
      }*/

      if (this.auth.companies.length > 0) {

        const found = this.auth.companies.find((data, key) => {
          if (data.company_id == this.auth.company_id) {
            this.auth.setEmployer(data);
            return true;
          }
        });

        if (!found) {
          if (this.auth.companies[0]) {
            this.auth.setEmployer(this.auth.companies[0]);

            this.eventService.companyChanged$.next({
              employer: this.auth.companies[0]
            });
          } else {
            this.auth.setEmployer(null);

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

  /**
   * Change app language
   * @param language
   */
  translateTo(language) {

    this.translateService.use(language.code).subscribe();

    this.auth.setLanguagePref(language.code);

    const companyHeader = document.getElementsByClassName('company-header');

    if (language.code == 'ar') {

      document.getElementsByTagName('html')[0].setAttribute('dir', 'rtl');
      
      if(companyHeader.length > 0 && companyHeader[0])
        companyHeader[0].setAttribute('dir', 'rtl');

    } else {

      document.getElementsByTagName('html')[0].setAttribute('dir', 'ltr');

      if(companyHeader.length > 0 && companyHeader[0])
        companyHeader[0].setAttribute('dir', 'ltr');
    }
  }

  /**
    * Get notification count after every minute
    */
  async alertSubscribe() {
    if (this.alertSubscription) {
      return null;
    }

    this.alertSubscription = setInterval(x => {
      this._updateAlert();
    }, 1 * 1000);
  }

  /**
   * Update alert count on app
   */
  async _updateAlert() {
    this.chatService.unreadCount().subscribe(async data => {

      if (data.operation && data.operation == 'error') {
        const toast = await this.toastCtrl.create({
          message: this.translateService.transform('Account deactivated'),
          duration: 3000,
          position: 'top',
          cssClass: 'error_toast_' + this.translateService.direction()
        });
        await toast.present();

        this.eventService.userLoggedOut$.next({});
      } 
      else 
      {
        this.eventService.alertCount$.next(data);
      }
    });
  }

}
