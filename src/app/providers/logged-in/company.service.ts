import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
//models
import { Company } from 'src/app/models/company';
//services
import { AuthHttpService } from "./authhttp.service";
import { AuthService } from '../auth.service';
import { Contact } from 'src/app/models/contact';


@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private _companyEndpoint: string = "/companies";

  constructor(
    private _auth: AuthService,
    private _authhttp: AuthHttpService
  ) {
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

  /**
   * Update company details
   * @param {Company} model
   * @returns {Observable<any>}
   */
  update(model: Company): Observable<any>{
    const url = `${this._companyEndpoint}`;
    const params = {
      name: model.company_name,
      email: model.company_email,
      common_name_en: model.company_common_name_en,
      common_name_ar: model.company_common_name_ar,
      description_en: model.company_description_en,
      description_ar: model.company_description_ar,
      website: model.company_website
    };

    return this._authhttp.patch(url, params);
  }

  /**
   * activate company account 
   * @returns {Observable<any>}
   */
  activate(params): Observable<any>{
    const url = `${this._companyEndpoint}/activate`;
    const params = {
      contact_auth_key: params.contact_auth_key,
      contact_email: params.contact_email,
      password: params.password,
      company_id: params.company_id,
      company_logo: params.company_logo,
      commercial_licence: params.commercial_licence,
      description: params.company_description_en,
      website: params.company_website
    };

    return this._authhttp.patch(url, params);
  }
  
  /**
   * Remove logo
   */
  removeLogo(): Observable<any> {
    const url = this._companyEndpoint + '/remove-logo';
    return this._authhttp.delete(url).pipe(map(res => {
      if (res.operation == 'success') {

        for (let company of this._auth.companies) {
          if (company.company_id == this._auth.company_id) {
            company.company_logo = null;
          }
        }

        if(this._auth.company) {
          this._auth.company.company_logo = null;
        }
      }

      return res;
    }));
  }
  
  /**
   * Update company logo
   * @param params
   */
  updateLogo(params): Observable<any> {
    const url = this._companyEndpoint + '/update-logo';
    return this._authhttp.patch(url, params);
  }
}
