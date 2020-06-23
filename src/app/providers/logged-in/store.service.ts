import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
//models
import {Company} from "../../models/company";

//services
import {AuthHttpService} from "./authhttp.service";

@Injectable({
  providedIn: 'root'
})
export class StoreService {


  private _storeEndpoint: string = "/stores";

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * View store details
   * @param store_id
   */
  view(store_id): Observable<any> {
    let url = this._storeEndpoint + '/view/' + store_id + '?expand=candidates';
    return this._authhttp.get(url);
  }

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
  listByCompany(company_id:number, page: number): Observable<any> {
    let url = this._storeEndpoint + '/' + company_id + '?page=' + page + '&expand=candidates';
    return this._authhttp.getRaw(url);
  }

  /**
   * List of all stores by company id
   * @returns {Observable<any>}
   */
  listByCompanyStore(page: number): Observable<any> {
    let url = this._storeEndpoint + '/company-store' + '?page=' + page + '&expand=subCompanies,stores,totalCandidates';
    return this._authhttp.get(url);
  }
}
