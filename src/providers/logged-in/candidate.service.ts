import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// Services
import { AuthHttpService } from './authhttp.service';

/**
 * Candidate API on Server
 */
@Injectable()
export class CandidateService {

  private _candidateEndpoint: string = "/candidates";

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * List of all candidates
   * @returns {Observable<any>}
   */
  list(): Observable<any> {
    let url = `${this._candidateEndpoint}?expand=store,university,country,company,bank`;
    return this._authhttp.get(url);
  }

}

