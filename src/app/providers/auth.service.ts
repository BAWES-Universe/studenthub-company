import { Injectable } from '@angular/core';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, first, map, retryWhen, take } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { genericRetryStrategy } from '../util/genericRetryStrategy';
import { Plugins } from '@capacitor/core';
//models
import { Company } from '../models/company';
import { Contact } from "../models/contact";
// service
import { environment } from '../../environments/environment';
import { EventService } from './event.service';


const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private accessToken;

  public id: any;
  public company_id: any;
  public profile_name: string;
  public email: string;
  public role: string;

  public company: Company;

  public isLogged = false;

  public displayCookieMessage = '0';

  public showOneSignalPrompt = false;

  public navEnable = true;

  public currency_pref = 'USD';

  public companies: Company[] = [];

  private urlBasicAuth = '/auth/login';
  public urlLocate = '/auth/locate';
  private _urlUpdatePass = '/auth/update-password';
  private _urlResetPassRequest = '/auth/request-reset-password';
  public _urlInvitation = '/invitations/by-otp/';
  public urlRegistration = '/auth/create-account';

  constructor(
    public http: HttpClient,
    public router: Router,
    public eventService: EventService
  ) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
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

      Storage.get({ key: 'loggedInCompany' }).then(ret => {
        const data = JSON.parse(ret.value);

        if (data) {

          this.isLogged = true;

          this.accessToken = data.token;
          this.company_id = data.company_id;
          this.email = data.email;
          this.profile_name = data.profile_name;
          this.id = data.id;

          resolve(true);
        } else {
          resolve(false);
          this.logout('invalid access');
        }
      }).catch(r => {
        this.eventService.errorStorage$.next();
      });
    });
  }

  /**
   * Save user data in storage
   */
  saveInStorage() {
    return Storage.set({
      key: 'loggedInCompany',
      value: JSON.stringify({
        token: this.accessToken,
        company_id: this.company_id,
        profile_name: this.profile_name,
        email: this.email,
        id: this.id
      })
    }).catch(r => {
      this.eventService.errorStorage$.next();
    });
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

    this.isLogged = false;

    // Remove from Storage then process logout

    this.accessToken = null;
    this.company_id = null;
    this.profile_name = null;
    this.email = null;
    this.id = null;

    Storage.clear().catch(r => {
      this.eventService.errorStorage$.next();
    });

    if (!silent) {
      this.eventService.userLoggedOut$.next(reason ? reason : false);
    }

    Storage.set({
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
    this.id = response.contact ? response.contact?.contact_uuid : response.id;

    // Save to Storage
    this.saveInStorage();

    if (this.accessToken) {
      this.isLogged = true;
      this.eventService.userLogined$.next({ redirect });
    }
  }

  // This is the method you want to call at bootstrap
  async load(): Promise<any> {
    Storage.get({ key: 'loggedInCompany' }).then(ret => {

      let company = JSON.parse(ret.value);

      if (company && company.token) {
        return this.setAccessToken(company);
      } else {
        // return this.logout('error with store variables',true);
      }
    }).catch(r => {
      this.eventService.errorStorage$.next();
    });
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

    Storage.get({ key: 'loggedInCompany' }).then(ret => {
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
    const url = environment.apiEndpoint + this.urlBasicAuth;
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

  /**
   * json to string error message
   * @param message
   */
  errorMessage(message): string {

    if (message.length) {
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
   * @param contact
   * @param otp
   */
  createAccount(contact: Contact, otp: string): Observable<any> {
    const url = environment.apiEndpoint + this.urlRegistration;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const params = {
      name: contact.contact_name,
      email: contact.contact_email,
      password: contact.contact_password_hash,
      otp
    };

    return this.http.post(url, JSON.stringify(params), { headers })
      .pipe(
        retryWhen(genericRetryStrategy()),
        catchError(err => this._handleError(err)),
        first(),
        map((res: HttpResponse<any>) => res)
      );
  }
}
