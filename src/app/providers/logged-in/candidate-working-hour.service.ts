import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//services
import { AuthHttpService } from './authhttp.service';

@Injectable({
  providedIn: 'root'
})
export class CandidateWorkingHourService {

  private _endpoint = '/candidate-working-hours';

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * Return invitations
   * @returns {Observable<any>}
   */
  list(page: number, param = ""): Observable<any>{
    const url = this._endpoint + `/date?page=${page}${param}`;
    return this._authhttp.getRaw(url);
  }

  /**
   * get total time per day, checkIn, checkOut etc 
   * @param param 
   * @returns 
   */
  stats(param: string): Observable<any>{
    const url = this._endpoint + `/stats?${param}`;
    return this._authhttp.get(url);
  }

  /**
   * Return invitations
   * @returns {Observable<any>}
   */
  listByHour(page: number, param = null): Observable<any>{
    const url = this._endpoint + `/hour?page=${page}&expand=store,store.company,candidate${param}`;
    return this._authhttp.getRaw(url);
  }
}
