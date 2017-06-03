import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// Services
import { AuthHttpService } from './authhttp.service';

import { Transfer } from '../../models/transfer';

/**
 * Manages Staff Functionality on the server
 */
@Injectable()
export class TransferService {

  private _transferEndpoint: string = "/transfers";

  public STATUS_PAYMENT_SENT = 1;
  public STATUS_PAYMENT_RECEIVED = 2;
  public STATUS_SALARY_DISTRIBUTION_IN_PROGRESS = 3;
  public STATUS_TRANSFER_COMPLETE = 4;
  public STATUS_LOCK = 5;
  public STATUS_INITIATED = 10;

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * List of all staff
   * @returns {Observable<any>}
   */
  list(page: number): Observable<any> {
    let url = `${this._transferEndpoint}?page=${page}`;
    return this._authhttp.getRaw(url);
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
  downloadInvoice(invoice_id: number): Observable<any> {
    let url = `${this._transferEndpoint}/pdf/${invoice_id}`;
    return this._authhttp.pdfget(url, 'Invoice ' + invoice_id + ' Details.pdf');
  }

  /**
   * Generating Invoice copy
   * @param {number} invoice_id
   * @returns {Observable<any>}
   */
  downloadReceipt(invoice_id: number): Observable<any> {
    let url = `${this._transferEndpoint}/pdf/${invoice_id}`;
    return this._authhttp.pdfget(url, 'Receipt ' + invoice_id + ' Details.pdf');
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
