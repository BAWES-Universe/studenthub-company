import { Injectable, RendererFactory2 } from '@angular/core';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, first, map, retryWhen, take } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { genericRetryStrategy } from '../util/genericRetryStrategy';
import { Preferences } from '@capacitor/preferences';
import { AlertController, LoadingController, NavController } from "@ionic/angular";
import { environment } from '../../environments/environment';
import {
  SignInWithApple,
  SignInWithAppleResponse,
  SignInWithAppleOptions,
} from '@capacitor-community/apple-sign-in';
//models
import { Company } from '../models/company';
import { Contact } from "../models/contact";
import { CompanyContact } from '../models/company-contact';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
// service
import { EventService } from './event.service';
import { TranslateLabelService } from './translate-label.service';
import { CompanyRequest } from '../models/company-request';


declare var navigator;

declare var AppleID;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private accessToken;

  public utm_uuid;
  
  public id: any;
  public company_id: any;
  public profile_name: string;
  public email: string;
  public role: string;
  public active_request_count: any;
  public theme: string;

  public company: Company;

  public isLogged = false;

  public appleAuthLoading = false; 

  public displayCookieMessage = '0';

  public showOneSignalPrompt = false;

  public navEnable = true;

  public currency_pref = 'KWD';

  public companies: Company[] = [];

  public language_pref: string;

  public language = {
    code: 'en',
    name: 'English'
  };
  
  public currencies = [];//available currencies 
    
  public currentLocation = null; 

  public renderer;

  public _urlLoginAuth0 = '/auth/login-auth0';
  private _urlBasicAuth = '/auth/login';
  private _urlUpdatePass = '/auth/update-password';
  private _urlResetPassRequest = '/auth/request-reset-password';
  private _urlInvitation = '/invitations/by-otp/';
  private _urlRegistration = '/auth/create-account';
  private _urlresendVerificationEmail = '/auth/resend-verification-email';
  private _urlUpdateCandidateEmail = '/auth/update-email';
  private _urlIsEmailVerified = '/auth/is-email-verified';
  private _urlVerifyEmail = '/auth/verify-email';
  public urlLoginByApple = '/auth/login-by-apple';
  public _urlLocate = '/auth/locate';
  public _urlLoginByGoogle = '/auth/login-by-google';
  public _urlLoginByKey  = '/auth/login-by-key';

  constructor(
    public http: HttpClient,
    public router: Router,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public rendererFactory: RendererFactory2,
    public eventService: EventService,
    public translate: TranslateLabelService,
    public alertCtrl: AlertController
  ) { 
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    /*if (route.routeConfig.path == 'cv-search' && this.active_request_count == '0') {

      this.alertCtrl.create({
          header: 'CV Search Usage Alert',
          message: 'Please create request to use search & wait for staff to look into the request.',
          buttons: ['Okay']
      }).then( alert => {
        alert.present();
      });

      return this.router.navigate(['/']);
    }*/

    /**
     * new router changes don't wait for startup service
     * https://github.com/angular/angular/issues/14615
     */
    return new Promise(async resolve => {

      this.navEnable = true;

      if (route.data.navDisable) {
        this.navEnable = false;
      }

      if (this.isLogged) {
        resolve(true);
      }

      Preferences.get({ key: 'loggedInCompany' }).then(ret => {
        
        const data = JSON.parse(ret.value);

        if (data && data.token) {

          this.isLogged = true;

          this.accessToken = data.token;
          this.company_id = data.company_id;
          this.email = data.email;
          this.profile_name = data.profile_name;
          this.active_request_count = data.active_request_count;
          this.theme = data.theme;

          resolve(true);
        } else {
          resolve(false);
          this.navCtrl.navigateRoot(['login']);
        }
      }).catch(r => {
        resolve(false);

        this.eventService.errorStorage$.next();
      });
    });
  }

  /**
   * Save user data in storage
   */
  saveInStorage() {
    return Preferences.set({
      key: 'loggedInCompany',
      value: JSON.stringify({
        token: this.accessToken,
        company_id: this.company_id,
        profile_name: this.profile_name,
        email: this.email,
        active_request_count: this.active_request_count,
        language_pref: this.language_pref,
        theme: this.theme
      })
    }).catch(r => {
      this.eventService.errorStorage$.next();
    });
  }

  /**
   * login with AppleJS for PWA
   */
  async loginByAppleJs() {
    
    this.appleAuthLoading = true;

    try {

      const data = await AppleID.auth.signIn();

      let params;

      if (data.user && data.user.familyName) {

        Preferences.set({
          key: 'appleUserDetail',
          value: JSON.stringify({
            email: data.user.email,
            familyName: data.user.name.familyName,
            givenName: data.user.name.givenName
          })
        }).catch(r => {
          this.eventService.errorStorage$.next(r);
        });

        params = {
          identityToken: data.authorization.id_token,
          email: data.user.email,
          familyName: data.user.name.familyName,
          givenName: data.user.name.givenName
        };
      }
      else
      {
        let oldData = await Preferences.get({ key: 'appleUserDetail'});

        params = Object.assign((oldData) ? oldData : {}, {
          identityToken: data.authorization.id_token
        });
      }

      this.handleAppleLoginResponse(params);

    } catch (error) {
      console.error(error);
      // popup_closed_by_user
      this.appleAuthLoading = false;
    }
  }

  /**
   * login by Apple sign in
   */
  async loginByApple() {

    this.appleAuthLoading = true;
    
    let options: SignInWithAppleOptions = {
      clientId: 'co.studenthub.candidate',
      redirectURI: 'http://localhost:8100/landing',
      scopes: 'email name',
      state: '12345',
      nonce: 'nonce',
    };

    SignInWithApple.authorize(options)
      .then((result: SignInWithAppleResponse) => {
        this.appleAuthLoading = false;
        this.handleAppleLoginResponse(result);
      })
      .catch(error => {
        this.appleAuthLoading = false;
        this.handleAppleLoginResponse(error);
      });
  }

  /**
   * handle response from apple login popup
   * @param data
   */
  async handleAppleLoginResponse(data) {
    
    if (!data || !data.response || !data.response.identityToken) {
      this.appleAuthLoading = false;

      if(data.message && data.message.indexOf("AuthorizationError") == -1) {
        this.showLoginError(this.translate.transform(data.message));
      }

      return null;
    }
    console.log('response', data);

    let params;

    // save user data in first request
    console.log(data);
    if (data.response.givenName) {

      Preferences.set({
        key: 'appleUserDetail',
        value: JSON.stringify({
          email : data.response.email,
          familyName : data.response.familyName,
          user : data.response.user,
          givenName : data.response.givenName
        })
      }).catch(r => {
        this.eventService.errorStorage$.next(r);
      });

      params = data.response;
    }
    else {
      let oldData = await Preferences.get({ key : 'appleUserDetail'});

      params = Object.assign((oldData) ? oldData : {}, data.response);
    }

    this.useAppleIdTokenForAuth(params);
  }

  /**
   * login/sign up by apple auth code
   * @param params
   */
  useAppleIdTokenForAuth(params) {

    params.utm_uuid = this.utm_uuid;

    const url = environment.apiEndpoint + this.urlLoginByApple;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Language: this.translate.currentLang
    });

    this.http.post(url, params, {
      headers
    })
        .pipe(
            retryWhen(genericRetryStrategy()),
            catchError(err => this._handleError(err)),
            first(),
            map((res: HttpResponse<any>) => res)
        )
        .subscribe(response => {
          this.handleLogin(response, 'apple');

          this.appleAuthLoading = false;

        }, () => {
          this.appleAuthLoading = false;
        });
  }

  /**
   * Login by Auth0 accessToken
   */
   async useTokenForAuth(accessToken, showLoader = true) {

    let loading;

    if (showLoader) {
      loading = await this.loadingCtrl.create({
        spinner: 'crescent',
        message: this.translate.transform('Logging in...')
      });
      loading.present();
    }

    const url = environment.apiEndpoint + this._urlLoginAuth0;

    const headers = this._buildAuthHeaders();

    return this.http.post(url, {
      accessToken: accessToken,
      utm_uuid: this.utm_uuid
    }, {
      headers: headers
    })
      .pipe(
        retryWhen(genericRetryStrategy()),
        catchError((err) => this._handleError(err)),
        first(),
        map((res) => res)
      )
      .subscribe(async response => {

        this.handleLogin(response);
        //this.eventService.googleLoginFinished$.next();

      }, err => {

        //this.eventService.googleLoginFinished$.next(err);
      },
      () => {
        if (loading) {
          loading.dismiss();
        }
      });
  }

  async handleLogin(response, channel = null) {
    
    if (response.operation == 'success') {

      this.setAccessToken(response);

    } else if (response.operation == 'error') {
      const alert = await this.alertCtrl.create({
        message: this.translate.transform('Error getting login by Auth0 API'), // JSON.stringify(err)
        buttons: [this.translate.transform('Ok')]
      });
      await alert.present();

    }
  }

  /**
   * show login error message
   * @param message
   */
  async showLoginError(message = null) {
    const alert = await this.alertCtrl.create({
      message: message? message: this.translate.transform('Error getting login'),
      buttons: [this.translate.transform('Okay')]
    });
    await alert.present();
  }

  /**
   * Save company when user change company
   */
  setActiveRequest(count) {
    this.active_request_count = count;

    return this.saveInStorage();
  }

  /**
   * Save company when user change company
   */
  setEmployer(company: Company) {
    this.company = company;

    this.company_id = company ? company.company_id : null;

    return this.saveInStorage();
  }

  /**
   * Logs a user out by setting logged in to false and clearing token from storage
   * @param reason
   * @param silent
   */
  logout(reason?: string, silent = false) {

    console.log('auth logout');

    this.isLogged = false;

    // Remove from Storage then process logout

    this.accessToken = null;
    this.company_id = null;
    this.profile_name = null;
    this.email = null;
    this.active_request_count = null;

    Preferences.clear().catch(r => {
      this.eventService.errorStorage$.next();
    });

    if(this.utm_uuid) {
      Preferences.set({ key: 'utm_uuid', value: this.utm_uuid });
    }

    Preferences.set({ key: 'theme', value: this.theme });

    if (!silent) {
      this.eventService.userLoggedOut$.next(reason ? reason : false);
    }

    Preferences.set({
      key: 'cookieMessageWasApproved',
      value: (this.displayCookieMessage == '0') ? '1' : '0'
    }).catch(r => {
      this.eventService.errorStorage$.next();
    });
  }

  /**
   * Set the access token
   */
  setAccessToken(response, redirect = false) {

    this.accessToken = response.token;
    this.company_id = response.company_id;
    this.profile_name = response.profile_name;
    this.email = response.email;
    this.active_request_count = response.active_request_count;

    if(response.currency_pref)
      this.currency_pref = response.currency_pref;

    // Save to Storage
    this.saveInStorage();

    if (this.accessToken) {
      this.isLogged = true;
      this.eventService.userLogined$.next({ redirect });
    }
  }

  // This is the method you want to call at bootstrap
  async load(): Promise<any> {

    const promises = [
      Preferences.get({ key: 'currentLocation' }),
      Preferences.get({ key: 'loggedInCompany' }),
      Preferences.get({ key: 'language_pref' }),
      Preferences.get({ key: 'currency_pref' }),
      Preferences.get({ key: 'utm_uuid' }),
      Preferences.get({ key: 'theme' }),
    ];

    return Promise.all(promises).then(data => {

      if(data[5].value) {
        this.setTheme(data[5].value);
      }

      if(data[4].value) {
        this.utm_uuid = data[4].value;
      } else {
        this.utm_uuid = window.localStorage.getItem("utm_id");
      }

      if(data[3].value) {
        this.currency_pref = data[3].value;
      }

      if(data[0] && data[0].value) {
        this.currentLocation = JSON.parse(data[0].value);
      }  

      let company = JSON.parse(data[1].value);

      // guest user who visited previously and saved preference

      const { value } = data[2];

      if (value) {
        this.language_pref = value;

        this.language = this.language_pref == 'ar' ? {
          name: 'عربى',
          code: 'ar'
        } : {
          code: 'en',
          name: 'English'
        };

        // new user

      } else {

        const browserLanguage = navigator.languages
          ? navigator.languages[0]
          : (navigator.language || navigator.userLanguage);

        if (browserLanguage && browserLanguage.indexOf('en') > -1) {
          this.language = {
            code: 'en',
            name: 'English'
          };
        } else {
          this.language = {
            name: 'عربى',
            code: 'ar'
          };
        }
      }

      // for guest use language value in storage, for login user loggedInAgent.language_pref

      if (company && company.language_pref) {
        this.language = company.language_pref == 'ar' ? {
          name: 'عربى',
          code: 'ar'
        } : {
          code: 'en',
          name: 'English'
        };
      }

      this.translate.setDefaultLang('en');

      this.translate.use(this.language.code);

      document.getElementsByTagName('html')[0].setAttribute('dir', (this.language.code == 'ar') ? 'rtl' : 'ltr');

      if (company && company.token) {
        this.setAccessToken(company);
      } else {
        //console.log('redirect to login');
        //this.router.navigate(['/login']);
        // return this.logout('error with store variables',true);
      }
    }).catch(r => {
      this.eventService.errorStorage$.next();
    });
  }

  /**
   * set app theme
   * @param theme
   */
  setTheme(theme) {
    Preferences.set({ key: 'theme', value: theme });

    this.theme = theme;

    if (theme == 'night') {
      this.renderer.removeClass(document.body, 'day');
      this.renderer.addClass(document.body, 'night');
    } else {
      this.renderer.addClass(document.body, 'day');
      this.renderer.removeClass(document.body, 'night');
    }
  }

  /**
   * Get Access Token from Service or Cookie
   * @returns {string} token
   */
  getAccessToken(redirect = false) {

    // Return Access Token if set already
    if (this.accessToken) {
      return this.accessToken;
    }

    Preferences.get({ key: 'loggedInCompany' }).then(ret => {
      const user = JSON.parse(ret.value);

      if (user) {
        this.setAccessToken(user, redirect);
        this.accessToken = user.token;
      }
    }).catch(r => {
      this.eventService.errorStorage$.next();
    });

    return this.accessToken;
  }

  /**
   * Basic auth, exchanges access details for a bearer access token to use in
   * subsequent requests.
   * @param  {string} email
   * @param  {string} password
   */
  basicAuth(email: string, password: string): Observable<any> {
    // Add Basic Auth Header with Base64 encoded email and password
    const authHeader = new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${email}:${password}`),
    });
    const url = environment.apiEndpoint + this._urlBasicAuth;
    return this.http.get(url, {
      headers: authHeader,
    }).pipe(
      retryWhen(genericRetryStrategy()),
      first(),
      map((res: HttpResponse<any>) => res)
    );
  }

  /**
   * reset password request
   * @param email
   */
  resetPasswordRequest(email: string) {
    const url = environment.apiEndpoint + this._urlResetPassRequest;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Language: this.translate.currentLang
    });
    return this.http.post(url, { email }, { headers }).pipe(
      retryWhen(genericRetryStrategy()),
      catchError((err) => this._handleError(err)),
      first(),
      map((res) => res)
    );
  }

  /**
   * Change password by password reset token
   * @param token
   * @param newPassword
   */
  changePassword(newPassword: string, token: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.patch(environment.apiEndpoint + this._urlUpdatePass, {
      newPassword,
      token
    }, { headers }).pipe(
      retryWhen(genericRetryStrategy()),
      catchError((err) => this._handleError(err)),
      first(),
      map((res) => res)
    );
  }

  /**
   * Verify email
   * @param email
   * @param code
   */
  verifyEmail(email: string, code: string) {
    const url = environment.apiEndpoint + this._urlVerifyEmail;
    const headers = this._buildAuthHeaders();
    return this.http.post(url, { email: email, 'code': code }, { headers: headers }).pipe(
      retryWhen(genericRetryStrategy()),
      catchError((err) => this._handleError(err)),
      first(),
      map((res) => res)
    );
  }

  /**
   * Resend verification email
   * @param email
   */
   resendVerificationEmail(email: string) {
    const url = environment.apiEndpoint + this._urlresendVerificationEmail;
    const headers = this._buildAuthHeaders();
    return this.http.post(url, { 'email': email }, { headers: headers }).pipe(
      retryWhen(genericRetryStrategy()),
      catchError((err) => this._handleError(err)),
      first(),
      map((res) => res)
    );
  }

  /**
   * Check if email already verified
   * @param res
   */
   isAlreadyVerified(res): Observable<any> {
    const url = environment.apiEndpoint + this._urlIsEmailVerified;
    return this.http.post(url, res, { headers: this._buildAuthHeaders() }).pipe(
      retryWhen(genericRetryStrategy()),
      catchError((err) => this._handleError(err)),
      first(),
      map((res) => res)
    );
  }

  /**
   * Update email address
   * @param params params
   */
  updateEmail(params: any): Observable<any> {
    const url = environment.apiEndpoint + this._urlUpdateCandidateEmail;
    return this.http.post(url, params, { headers: this._buildAuthHeaders() }).pipe(
      retryWhen(genericRetryStrategy()),
      catchError((err) => this._handleError(err)),
      first(),
      map((res) => res)
    );
  }

  /**
   * Build the Auth Headers for All Verb Requests
   * @returns {HttpHeaders}
   */
   public _buildAuthHeaders() {
    // Get Bearer Token from Auth Service

    // Build Headers with Bearer Token
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Language': this.translate.currentLang,
      'Currency': this.currency_pref,
    });
  }

  /**
   * Handles Caught Errors from All Authorized Requests Made to Server
   * @returns {Observable}
   */
  private _handleError(error: any): Observable<any> {

    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';

    // Handle Bad Requests
    // This error usually appears when agent attempts to handle an
    // account that he's been removed from assigning
    if (error.status === 400) {
      this.eventService.accountAssignmentRemoved$.next();
      return EMPTY;
    }

    // Handle No Internet Connection Error /service worker timeout

    if (error.status === 0 || error.status === 504) {
      this.eventService.internetOffline$.next();
      return EMPTY;
    }

    if (!navigator.onLine) {
      this.eventService.internetOffline$.next();
      return EMPTY;
    }

    // Handle Expired Session Error
    if (error.status === 401) {
      this.logout('Session expired, please log back in.');
      return EMPTY;
    }

    // Handle internal server error - 500
    if (error.status === 500) {
      this.eventService.error500$.next();
      return EMPTY;
    }

    // Handle page not found - 404 error
    if (error.status === 404) {
      this.eventService.error404$.next();
      return EMPTY;
    }
    console.log('Error: ' + errMsg);

    return throwError(errMsg);
  }

  isString(x) {
    return Object.prototype.toString.call(x) === "[object String]"
  }

  /**
   * json to string error message
   * @param message
   */
  errorMessage(message): string {

    if (this.isString(message)) {
      return message + '';
    }

    let a = [];

    for (let i in message) {

      if (!Array.isArray(message[i])) {
        a.push(message[i]);
        continue;
      }

      for (let j of message[i]) {
        a.push(j);
      }
    }

    return a.join('<br />');
  }

  /**
   * get invitation detail by otp
   * @param otp
   */
  getInvitation(otp: string): Observable<any> {
    const url = environment.apiEndpoint + this._urlInvitation + otp;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get(url, { headers })
      .pipe(
        retryWhen(genericRetryStrategy()),
        catchError(err => this._handleError(err)),
        first(),
        map((res: HttpResponse<any>) => res)
      );
  }

  /**
   * create new account
   * @param CompanyRequest
   */
  createAccount(contact: CompanyRequest): Observable<any> {

    const url = environment.apiEndpoint + this._urlRegistration;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Language: this.translate.currentLang
    });

    const params = {
      name: contact.contact_name,
      email: contact.company_email,
      password: contact.contact_password_hash,
      requesting_for: contact.requesting_for,
      receive_email: contact.contact_receive_email,
      company_name: contact.company_name,
      contact_position: contact.contact_position,
      phone_number: contact.phone_number,
      currency_code: contact.currency_code,
      country_id: contact.country_id,
      utm_uuid: this.utm_uuid
    };

    return this.http.post(url, JSON.stringify(params), { headers })
      .pipe(
        retryWhen(genericRetryStrategy()),
        catchError(err => this._handleError(err)),
        first(),
        map((res: HttpResponse<any>) => res)
      );
  }

  /**
   * return user location detail by user ip address
   * @return Observable
   */
  locate(): Observable<any> {
    const url = environment.apiEndpoint + this._urlLocate;
    const headers = this._buildAuthHeaders();
    return this.http.get(url, { headers: headers })
      .pipe(
        retryWhen(genericRetryStrategy()),
        catchError((err) => this._handleError(err)),
        take(1),
        map((res) => res)
      );
  }

  /**
   * set currency selection 
   * @param currency 
   */
  setCurrencyPrf(currency) {

    Preferences.set({ 'key': 'currency_pref', value: currency.code }).catch(r => {
      this.eventService.errorStorage$.next();
    });

    this.currency_pref = currency.code;

    //this.currency = currency;

    if (this.accessToken) {
      this.saveInStorage();
    }
  }

  /**
   * Set language pref for current user
   */
  setLanguagePref(language_pref) {

    Preferences.set({ 'key': 'language_pref', value: language_pref }).catch(r => {
      this.eventService.errorStorage$.next();
    });

    this.language_pref = language_pref;

    this.language = this.language_pref == 'ar' ? {
      name: 'عربى',
      code: 'ar'
    } : {
      code: 'en',
      name: 'English'
    };

    if (this.accessToken) {
      this.saveInStorage();
    }
  }

  /**
   * login with auth key
   * @param auth_key 
   * @returns 
   */
  async loginByKey(auth_key: string) {
    
    const loading = await this.loadingCtrl.create({
      spinner: 'crescent',
      message: this.translate.transform('Logging in...')
    });
    loading.present();

    const url = environment.apiEndpoint + this._urlLoginByKey;

    const headers = this._buildAuthHeaders();

    return this.http.post(url, {
      auth_key: auth_key
    }, {
      headers
    })
      .pipe(
        retryWhen(genericRetryStrategy()),
        catchError((err) => this._handleError(err)),
        first(),
        map((res) => res)
      )
      .subscribe(async response => {

        if (response.operation == 'success') {

          this.setAccessToken(response, true);

        } else if (response.operation == 'error' && response.errorType == 'email-not-verified') {

          Preferences.set({ 'key': "unVerifiedToken", "value": JSON.stringify(response.unVerifiedToken) }).catch(r => {
            this.eventService.errorStorage$.next();
          });
  
          this.router.navigate([
            'verify-email',
            response['unVerifiedToken']['email']
          ]);
  
        } else if (response.operation == 'error') {
          const alert = await this.alertCtrl.create({
            message: this.errorMessage(response.message), // JSON.stringify(err)
            buttons: [this.translate.transform('Okay')]
          });
          await alert.present();

        }

        //this.eventService.googleLoginFinished$.next({});

      }, err => {

        //this.eventService.googleLoginFinished$.next(err);
      },
      () => {
        if (loading) {
          loading.dismiss();
        }
      });
  }

  /**
   * Login by Google for mobile app
   */
  loginByGoogle() {

    GoogleAuth.signIn().then(async googleUser => {
 
      if (googleUser && googleUser.authentication && googleUser.authentication.idToken) {
        this.useGoogleIdTokenForAuth(googleUser.authentication.idToken, false);
      } else {
        this.eventService.googleLoginFinished$.next({});

        this.showLoginError('Error getting login by Google+ API');
      }
    }).catch(async err => {

      console.error(err);

      this.eventService.googleLoginFinished$.next({});

      if (err = 'popup_closed_by_user') {
        return false;
      }

      this.showLoginError('Error getting login by Google+ API');
    }); 
  }
  
  /**
   * Login by google idToken
   */
  async useGoogleIdTokenForAuth(idToken, showLoader = true) {

    let loading;

    if (showLoader) {
      loading = await this.loadingCtrl.create({
        spinner: 'crescent',
        message: this.translate.transform('Logging in...')
      });
      loading.present();
    }

    const url = environment.apiEndpoint + this._urlLoginByGoogle;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Language: this.translate.currentLang || "en"
    });
    
    return this.http.post(url, {
      idToken: idToken,
    }, {
      headers: headers
    })
      .pipe(
        retryWhen(genericRetryStrategy()),
        catchError((err) => this._handleError(err)),
        first(),
        map((res) => res)
      )
      .subscribe(async response => {

        if (response.operation == 'success') {

          this.handleLogin(response, 'Google');

        } else if (response.operation == 'error') {
          const alert = await this.alertCtrl.create({
            message: this.translate.transform('Error getting login by Google+ API'), // JSON.stringify(err)
            buttons: [this.translate.transform('Ok')]
          });
          await alert.present();

        }

        this.eventService.googleLoginFinished$.next({});

      }, err => {

        this.eventService.googleLoginFinished$.next(err);
      },
      () => {
        if (loading) {
          loading.dismiss();
        }
      });
  }

  /**
   * Make date readable by Safari
   * @param date
   */
  toDate(date) {
    if (date) {
      return new Date(date.replace(/-/g, '/'));
    }
  }
}
