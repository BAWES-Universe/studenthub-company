import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// Services
import { AuthHttpService } from './authhttp.service';
// Model
import { Transfer } from '../../models/transfer';
import { Invoice } from '../../models/invoice';
/**
 * Manages Staff Functionality on the server
 */
@Injectable()
export class TransferService {

  private _transferEndpoint: string = "/transfers";

  public STATUS_PAYMENT_SENT = 1;
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
  makeTransfertoLock(transfer:Transfer): Observable<any> {
    let url = `${this._transferEndpoint}/lock/${transfer.transfer_id}`;
    return this._authhttp.patch(url, '');
  }

  /**
    * Mark Invoice as Payment Sent
    * @param {number} transfer_id
    * @returns {Observable<any>}
    */
  makePaymentSent(transfer: Transfer): Observable<any> {
    let url = `${this._transferEndpoint}/payment-sent/${transfer.transfer_id}`;
    return this._authhttp.patch(url, '');
  }

  /**
   * Generating Invoice copy
   * @param {number} invoice_id
   * @returns {Observable<any>}
   */
  downloadInvoice(invoice: Invoice): Observable<any> {
    let url = `${this._transferEndpoint}/pdf/${invoice.invoice_id}`;
    return this._authhttp.pdfget(url, 'Invoice ' + invoice.invoice_id + '.pdf');
  }

  /**
   * Generating Invoice copy
   * @param {number} invoice_id
   * @returns {Observable<any>}
   */
  downloadReceipt(invoice: Invoice): Observable<any> {
    let url = `${this._transferEndpoint}/pdf/${invoice.invoice_id}`;
    return this._authhttp.pdfget(url, 'Receipt ' + invoice.invoice_id + '.pdf');
  }

  /**
  * Save
  * @param { Transfer } transfer
  * @returns {Observable<any>}
  */
  save(transfer: Transfer): Observable<any> {
    let postUrl = `${this._transferEndpoint}`;
    let params = {
      "candidates": transfer.transferCandidates
    };
    return this._authhttp.post(postUrl, params);
  }

  /**
    * Update or Edit Transfer Form
    * @param { Transfer } transfer
    * @returns { Observable<any> }
    */
  updateTransfer(transfer: Transfer): Observable<any> {
    let postUrl = `${this._transferEndpoint}/${transfer.transfer_id}`;
    let params = {
      "candidates": transfer.transferCandidates
    };
    return this._authhttp.patch(postUrl, params);
  }

  /**
   * Delete Transfer
   * @param {number} transfer_id
   * @returns {Observable<any>}
   */
  delete(transfer: Transfer): Observable<any> {
    let url = `${this._transferEndpoint}/${transfer.transfer_id}`;
    return this._authhttp.delete(url);
  }

  /**
   * download transfer Template
   * @param {number} invoice_id
   * @returns {Observable<any>}
   */
  downloadTransferTemplate(): Observable<any> {
    let url = `${this._transferEndpoint}/transfer-excel-template`;
    return this._authhttp.excelget(url, `transfer-template.xlsx`);
  }

  /**
   * upload excel file to create new transfer
   * @param fileList 
   */
  uploadTransferExcel(fileList: FileList): Observable<any> {
    let url = this._transferEndpoint + '/create-by-excel';
    let file: File = fileList[0];
    let formData:FormData = new FormData();
    formData.append('excel', file, file.name);			
    return this._authhttp.uploadFile(url, formData);
  }
  
  /**
   * upload excel file to edit transfer
   * @param fileList 
   */
  updateTransferUploadExcel(fileList: FileList,transfer_id): Observable<any> {
    let url = this._transferEndpoint + '/edit-by-excel/'+transfer_id;
    let file: File = fileList[0];
    let formData:FormData = new FormData();
    formData.append('excel', file, file.name);			
    return this._authhttp.uploadFile(url, formData);
  }
}
