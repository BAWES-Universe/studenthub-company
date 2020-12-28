import { Injectable } from '@angular/core';

import { Observable } from "rxjs";
import { AuthHttpService } from "./authhttp.service";


@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  public algoliaConfig;

  private _candidateEndpoint: string = "/candidates";

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * List of all candidates
   * @returns {Observable<any>}
   */
  list(): Observable<any> {
    let url = `${this._candidateEndpoint}?expand=store,company`;
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
   * @param candidate_id
   */
  workHistory(candidate_id): Observable<any> {
    let url = this._candidateEndpoint + '/work-history/' + candidate_id + '?expand=store';
    return this._authhttp.get(url);
  }

  /**
   * candidate deatil
   * @param candidate_id
   */
  view(candidate_id): Observable<any> {
    const url = this._candidateEndpoint + '/' + candidate_id + '?expand=store,university,nationality,country,area,company';
    return this._authhttp.get(url);
  }
}
