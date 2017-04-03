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

  private _transferEndpoint: string = "/invoices";

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * List of all staff
   * @returns {Observable<any>}
   */
  list(): Observable<any> {
    let url = `${this._transferEndpoint}`;
    return this._authhttp.get(url);
  }

  /**
  * Details of each invoice_id
   * @param {number} invoice_id
  * @returns {Observable<any>}
  */
  transferIdDetails(invoice_id: number): Observable<any> {
    let url = `${this._transferEndpoint}/${invoice_id}`;
    return this._authhttp.get(url);
  }

  /**
    * Make Transfer To Lock Invoice Id
     * @param {number} invoice_id
    * @returns {Observable<any>}
    */
  makeTransfertoLock(invoice_id: number): Observable<any> {
    let url = `${this._transferEndpoint}/lock/${invoice_id}`;
    return this._authhttp.patch(url, '');
  }


  /**
      * Mark Invoice as Payment Sent
       * @param {number} invoice_id
      * @returns {Observable<any>}
      */
  makePaymentSent(invoice_id: number): Observable<any> {
    let url = `${this._transferEndpoint}/payment-sent/${invoice_id}`;
    return this._authhttp.patch(url, '');
  }

  /**
     * Generating Invoice copy
      * @param {number} invoice_id
     * @returns {Observable<any>}
     */
  generateInvoiceCopy(invoice_id: number): Observable<any> {
    let url = `${this._transferEndpoint}/pdf/${invoice_id}`;
    return this._authhttp.pdfget(url,invoice_id);
  }



  /**
  * Save
  * @param {Transfer} model
  * @returns {Observable<any>}
  */
  save(model: Transfer): Observable<any> {
    let postUrl = `${this._transferEndpoint}`;
    let params = {
      "candidates": model
    };
    return this._authhttp.post(postUrl, params);
  }


  /**
    * Update or Edit Transfer Form
    * @param {Transfer} model
    * @param {Number} invoice_id
    * @returns {Observable<any>}
    */
  updateInvoice(model: Transfer, invoice_id: Number): Observable<any> {
    let postUrl = `${this._transferEndpoint}/${invoice_id}`;
    let params = {
      "candidates": model
    };
    return this._authhttp.patch(postUrl, params);
  }

}
