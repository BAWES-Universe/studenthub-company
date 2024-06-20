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
  list(urlParams = "expand=store,company,currentWorkHistory"): Observable<any> {
    let url = `${this._candidateEndpoint}?${urlParams}`;
    return this._authhttp.get(url);
  }

  /**
   * @param currentPage 
   * @param urlParams 
   * @returns 
   */
  listCandidateWorkingDates(page: number, urlParams: string = "") : Observable<any> {
    let url = `${this._candidateEndpoint}/working-dates?page=${page}&${urlParams}`;
    return this._authhttp.getRaw(url);
  }

  /**
   * @param page 
   * @param urlParams 
   * @returns 
   */
  listWithPagination(page: number, urlParams: string): Observable<any> {
    let url = `${this._candidateEndpoint}/with-pagination?page=${page}&${urlParams}`;
    return this._authhttp.getRaw(url);
  }

  /**
   * list candidate applications
   * @param candidate_id 
   * @param page 
   * @returns 
   */
  listApplications(candidate_id: string, page: number) : Observable<any> {
    let url = this._candidateEndpoint + '/applications/'+ candidate_id +'?expand=request&page=' + page;//requestInterview
    return this._authhttp.getRaw(url);
  }
  
  /**
   * search candidate for request
   * @param match_request_id 
   * @param page 
   * @returns 
   */
  searchRequestMatch(match_request_id: any, page: number): Observable<any> {
    const url = this._candidateEndpoint + '/search?expand=cadndiateSkills,candidateExperiences,candidateTags&match_request_id=' + match_request_id + '&page=' + page;
    return this._authhttp.getRaw(url);
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
    let url = this._candidateEndpoint + '/work-history/' + candidate_id + '?expand=store,company';
    return this._authhttp.get(url);
  }

  /**
   * return work history
   * @param candidate_id
   */
  workHistoryDetail(id): Observable<any> {
    let url = this._candidateEndpoint + '/work-history-detail/' + id + '?expand=store,company';
    return this._authhttp.get(url);
  }

  /**
   * candidate deatil
   * @param candidate_id
   */
  view(candidate_id): Observable<any> {
    const url = this._candidateEndpoint + '/' + candidate_id + '?expand=isInvitedForCompany,invitedCount,store,university,nationality,country,area,company,candidateSkills,candidateExperiences';
    return this._authhttp.get(url);
  }
}
