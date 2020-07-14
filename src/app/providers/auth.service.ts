import { Injectable } from '@angular/core';
import { EMPTY, Observable, throwError } from "rxjs";
import { first, map, retryWhen, take } from "rxjs/operators";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { genericRetryStrategy } from "../util/genericRetryStrategy";
import { Storage } from '@ionic/storage';
// service
import { environment } from "../../environments/environment";
import { EventService } from "./event.service";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _accessToken;
  public company_id: number;
  public name: string;
  public email: string;

  public isLogged = false;

  public displayCookieMessage = false;

  public showOneSignalPrompt = false;
  private _urlBasicAuth: string = "/auth/login";
  public _urlLocate = '/auth/locate';

  constructor(
    public _http: HttpClient,
    public router: Router,
    public _storage: Storage,
    public eventService: EventService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    /**
     * new router changes don't wait for startup service
     * https://github.com/angular/angular/issues/14615
     */
    return new Promise(resolve => {

      if (this.isLogged) {
        resolve(true);
      }

      this._storage.get('loggedInCompany').then(data => {

        if (
          data &&
          data.token &&
          data.company_id &&
          data.name &&
          data.email
        ) {

          // to enable page to call restricted apis
          this.isLogged = true;
          this._accessToken = data.token;
          this.company_id = data.company_id;
          this.email = data.email;
          this.name = data.name;

          // set token without redirect if not already setting
          // this.setAccessToken(data, false);
          resolve(true);
        } else {
          resolve(false);
          this.logout('invalid access');
        }
      });
    });
  }

  /**
   * Save user data in storage
   */
  saveInStorage() {
    return this._storage.set('loggedInCompany', {
      token: this._accessToken,
      company_id: this.company_id,
      name: this.name,
      email: this.email
    });
  }

  /**
  * Logs a user out by setting logged in to false and clearing token from storage
  * @param {string} [reason]
  * @param {boolean} [silent]
  */
  logout(reason?: string, silent = false) {

    this.isLogged = false;

    // Remove from Storage then process logout

    this._accessToken = null;
    this.company_id = null;
    this.name = null;
    this.email = null;
    this._storage.clear();

    if (!silent) {
      this.eventService.userLoggedOut$.next(reason ? reason : false);
    }
    this._storage.set('cookieMessageWasApproved', !this.displayCookieMessage);
  }

  /**
   * Set the access token
   */
  setAccessToken(response, redirect = false) {

    console.log(response);
    this._accessToken = response.token;
    this.company_id = response.company_id;
    this.name = response.name;
    this.email = response.email;

    // Save to Storage
    this.saveInStorage();

    if (this._accessToken) {
      this.isLogged = true;
      this.eventService.userLogined$.next({ redirect: redirect });
    }
  }

  // This is the method you want to call at bootstrap
  load(): Promise<any> {
    const promises = [
      this._storage.get('loggedInCompany')
    ];

    return Promise.all(promises).then(data => {
      // for guest use language value in storage, for login user loggedInAgent.language_pref


      if (data[0] && data[0].token) {
        return this.setAccessToken(data[0]);
      } else {
        // return this.logout('error with store variables',true);
      }
    });
  }

  /**
   * Get Access Token from Service or Cookie
   * @returns {string} token
   */
  getAccessToken(redirect = false) {

    // Return Access Token if set already
    if (this._accessToken) {
      return this._accessToken;
    }

    this._storage.get('loggedInCompany').then(data => {

      if (data) {

        this.setAccessToken(
          data,
          redirect
        );

        this._accessToken = data.token;
      } else {
        //  this.logout('error with store variables');
      }
    });

    return this._accessToken;
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
      'Authorization': 'Basic ' + btoa(`${email}:${password}`),
    });
    const url = environment.apiEndpoint + this._urlBasicAuth;
    return this._http.get(url, {
      headers: authHeader,
    }).pipe(
      retryWhen(genericRetryStrategy()),
      first(),
      map((res: HttpResponse<any>) => res)
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
}
