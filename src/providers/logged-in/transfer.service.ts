import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// Services
import { AuthHttpService } from './authhttp.service';

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
  * Details of each Transfer
   * @param {number} transfer_id
  * @returns {Observable<any>}
  */
  transferIdDetails(transfer_id: number): Observable<any> {
    let url = `${this._transferEndpoint}/${transfer_id}?expand=transferCandidates,invoices`;
    return this._authhttp.get(url);
  }

  /**
    * Make Transfer To Lock Transfer
     * @param {number} transfer_id
    * @returns {Observable<any>}
    */
  makeTransfertoLock(transfer_id: number): Observable<any> {
    let url = `${this._transferEndpoint}/lock/${transfer_id}`;
    return this._authhttp.patch(url, '');
  }

  /**
    * Mark Invoice as Payment Sent
    * @param {number} transfer_id
    * @returns {Observable<any>}
    */
  makePaymentSent(transfer_id: number): Observable<any> {
    let url = `${this._transferEndpoint}/payment-sent/${transfer_id}`;
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
  * @param {candidate_id: number, hours: number, bonus: number} candidates
  * @returns {Observable<any>}
  */
  save(candidates: {candidate_id: number, hours: number, bonus: number}): Observable<any> {
    let postUrl = `${this._transferEndpoint}`;
    let params = {
      "candidates": candidates
    };
    return this._authhttp.post(postUrl, params);
  }

  /**
    * Update or Edit Transfer Form
    * @param {candidate_id: number, hours: number, bonus: number} candidates
    * @param { Number } transfer_id
    * @returns { Observable<any> }
    */
  updateTransfer(candidates: {candidate_id: number, hours: number, bonus: number}, transfer_id: Number): Observable<any> {
    let postUrl = `${this._transferEndpoint}/${transfer_id}`;
    let params = {
      "candidates": candidates
    };
    return this._authhttp.patch(postUrl, params);
  }

  /**
   * Delete Transfer
   * @param {number} transfer_id
   * @returns {Observable<any>}
   */
  delete(transfer_id: number): Observable<any> {
    let url = `${this._transferEndpoint}/${transfer_id}`;
    return this._authhttp.delete(url);
  }
}
