import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// Services
import { AuthHttpService } from './authhttp.service';
// Models
import { Candidate } from '../../models/candidate';

/**
 * Manages Staff Functionality on the server
 */
@Injectable()
export class CandidateService {

  private _candidateEndpoint: string = "/candidates";

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * List of all staff
   * @returns {Observable<any>}
   */
  list(): Observable<any>{
    let url = this._candidateEndpoint;
    return this._authhttp.get(url);
  }

}
