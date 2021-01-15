import { Injectable } from '@angular/core';
import {AuthHttpService} from "./authhttp.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private _companyEndpoint: string = "/companies";

  constructor(private _authhttp: AuthHttpService) {

  }

  /**
   * List of all companies
   * @returns {Observable<any>}
   */
  list(): Observable<any> {
    let url = this._companyEndpoint;
    return this._authhttp.get(url);
  }

  /**
   * List of child companies
   * @returns {Observable<any>}
   */
  listChild(page: number): Observable<any> {
    let url = this._companyEndpoint + '/list-child?page=' + page;
    return this._authhttp.getRaw(url);
  }

  /**
   * List of all company
   * @returns {Observable<any>}
   */
  view(company_id): Observable<any> {
    return this._authhttp.get(this._companyEndpoint + '/'+company_id);
  }
}
