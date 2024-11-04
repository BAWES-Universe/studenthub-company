import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthHttpService } from './authhttp.service';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  private _endpoint = '/contracts';

  constructor(private authhttp: AuthHttpService) { }

  /**
   * List of all notest
   * @param page
   * @param searchParams
   */
  list(keyword: string = '', page = null): Observable<any> {
    let url = this._endpoint + '?expand=amount&keyword=' + keyword;

    if(page) {
      url += '&page=' + page;
      return this.authhttp.getRaw(url);
    }

    return this.authhttp.get(url);
  }

  /**
   * Return contract detail
   * @param contract_uuid
   */
  view(contract_uuid): Observable<any> {
    const url = this._endpoint + '/' + contract_uuid + '?expand=amount';
    return this.authhttp.get(url);
  }
}
