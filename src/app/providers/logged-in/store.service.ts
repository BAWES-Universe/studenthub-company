import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
//models
//import {Company} from "../../models/company";
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
    let url = this._storeEndpoint + '/view/' + store_id + '?expand=candidates,mall,brand';
    return this._authhttp.get(url);
  }

  /**
   * request to unassign to change store 
   * @param store_id 
   * @param candidate_id 
   * @returns 
   */
  storeAssignmentRequest(candidate_id: number, store_id: number | null = null): Observable<any> {
    let url = this._storeEndpoint + '/store-assignment-request';
    return this._authhttp.post(url, {
      store_id: store_id,
      candidate_id: candidate_id
    });
  }

  /**
   * @param sar_uuid \
   * @returns 
   */
  cancelAssignmentRequest(sar_uuid: string): Observable<any> {
    let url = this._storeEndpoint + '/cancel-store-assignment-request/' + sar_uuid;
    return this._authhttp.patch(url, {
    });
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
  listByCompany(company_id: number, page: number): Observable<any> {
    let url = this._storeEndpoint + '/' + company_id + '?page=' + page + '&expand=candidates';
    return this._authhttp.getRaw(url);
  }

  /**
   * List of all stores by company id
   * @returns {Observable<any>}
   */
  listByCompanyStore(page: number, params = '&expand=candidates,totalCandidates,candidates.storeAssignmentRequest,mall,brand,company'): Observable<any> {
    // let url = this._storeEndpoint + '/company-store' + '?page=' + page + '&expand=candidates,subCompanies,stores,stores.mall,stores.brand,stores.candidates,totalCandidates';
    let url = this._storeEndpoint + '/company-store' + '?page=' + page + params;
    return this._authhttp.getRaw(url);
  }
}
