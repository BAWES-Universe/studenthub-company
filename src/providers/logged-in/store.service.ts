import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// Services
import { AuthHttpService } from './authhttp.service';

/**
 * Manages Staff Functionality on the server
 */
@Injectable()
export class StoreService {

  private _storeEndpoint: string = "/stores";

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * List of all stores
   * @returns {Observable<any>}
   */
  list(page: number): Observable<any> {
    let url = this._storeEndpoint + '?page=' + page;
    return this._authhttp.getRaw(url);
  }

  /**
   * List of all stores by company id
   * @returns {Observable<any>}
   */
  listByCompany(company_id: number, page: number): Observable<any> {
    let url = this._storeEndpoint + '/' + company_id + '?page=' + page;
    return this._authhttp.getRaw(url);
  }


  /**
   * List of all stores by company id
   * @returns {Observable<any>}
   */
  listByCompanyStore(page: number): Observable<any> {
    let url = this._storeEndpoint + '/company-store' + '?page=' + page;
    return this._authhttp.get(url);
  }
}

