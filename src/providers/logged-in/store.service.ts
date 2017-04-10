import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// Services
import { AuthHttpService } from './authhttp.service';
// Models
import { Store } from '../../models/store';

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
}

