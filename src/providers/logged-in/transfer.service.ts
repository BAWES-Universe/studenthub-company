import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// Services
import { AuthHttpService } from './authhttp.service';
// Models
import { Candidate } from '../../models/candidate';
import { Transfer } from '../../models/transfer';

/**
 * Manages Staff Functionality on the server
 */
@Injectable()
export class TransferService {

  private _transferEndpoint: string = "/transfers";

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * List of all staff
   * @returns {Observable<any>}
   */
  list(): Observable<any>{
    let url = this._transferEndpoint;
    return this._authhttp.get(url);
  }

   /**
   * Details of each transfer_id
   * @returns {Observable<any>}
   */
  transferIdDetails(transfer_id:number): Observable<any>{
    let url = `${this._transferEndpoint}/${transfer_id}`;
    return this._authhttp.get(url);
  }

 /**
   * Make Transfer To Lock Transfer Id
   * @returns {Observable<any>}
   */
  makeTransfertoLock(transfer_id:number): Observable<any>{   
    let url = `${this._transferEndpoint}/lock/${transfer_id}`;
    return this._authhttp.patch(url,'');
  }

   /**
   * Save
   * @param {Transfer} model
   * @returns {Observable<any>}
   */
  save(model: Transfer): Observable<any>{
    let postUrl = `${this._transferEndpoint}`;
    let params = {
      "candidates": model
    };
    return this._authhttp.post(postUrl, params);
  }

}
