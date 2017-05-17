import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// Services
import { AuthHttpService } from './authhttp.service';

/**
 * Manages Staff Functionality on the server
 */
@Injectable()
export class CandidateService {

  private _candidateEndpoint: string = "/candidates";

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * List of all candidates
   * @returns {Observable<any>}
   */
  list(page: number): Observable<any> {
    let url = this._candidateEndpoint + '?page=' + page;
    return this._authhttp.getRaw(url);
  }

  /**
   * List of all candidates with pagination 
   * @returns {Observable<any>}
   */
  listAll(): Observable<any> {
    let url = this._candidateEndpoint + '/all';
    return this._authhttp.get(url);
  }  
}

