import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// Services
import { AuthHttpService } from './authhttp.service';
// Models
import { Candidate } from '../../models/candidate';
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

  /**
   * Return total no of candidates
   * working for them 
   * @returns {Observable<any>}
   */
  total(): Observable<any> {
    let url = `${this._candidateEndpoint}/total`;
    return this._authhttp.get(url);
  }

  /**
   * return work history
   * @param candidate 
   */
  workHistory(candidate:Candidate): Observable<any> {
    let url = this._candidateEndpoint +'/work-history/'+ candidate.candidate_id;
    return this._authhttp.get(url);
  }  
}

