import { Component } from '@angular/core';
import { NavController, ViewController, LoadingController, AlertController, NavParams } from 'ionic-angular';
// Forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidator } from '../../../../validators/custom.validator';

// Models
import { Transfer, InvoiceModel, InvoiceCandidateMember } from '../../../../models/transfer';
import { TransferService } from '../../../../providers/logged-in/transfer.service';

@Component({
  selector: 'page-transfer-form',
  templateUrl: 'transfer-form.html'
})
export class TransferFormPage {

  public model: Transfer;
  public operation: string;
  public form: FormGroup;
  public candidatesObj;
  public invoiceCandidatesObj;
  public candidates: any = []
  public hours: any = [];
  public bonus: any = [];
  public hourly_rate: any = [];
  public invoiceModel: InvoiceModel;
  public editForm: boolean;

  public invoiceCandidateMember: InvoiceCandidateMember[];

  constructor(
    params: NavParams,
    public navCtrl: NavController,
    public transferService: TransferService,
    private _viewCtrl: ViewController,
    private _fb: FormBuilder,
    private _loadingCtrl: LoadingController,
    private _alertCtrl: AlertController,
  ) {

    // Load the passed model if available
    this.model = params.get('model');
    this.candidatesObj = params.get('candidates')
    this.invoiceModel = params.get('invoiceModel');
    this.editForm = params.get('editModel');

    if(this.editForm){
      this.invoiceCandidatesObj = this.invoiceModel.candidates;
    }
    

  }

  /**
   * Total Hours in KD
   */
  totalHours() {
    var sum = this.hours.reduce((a, b) => Number(a) + Number(b), 0);
    var bonus = this.bonus.reduce((a, b) => Number(a) + Number(b), 0);
    return sum + bonus;
  }

  /**
 * Total Amount in KD
 */
  totalAmount() {
    var sum = this.hours.reduce((a, b) => Number(a) + Number(b), 0);
    var bonus = this.bonus.reduce((a, b) => Number(a) + Number(b), 0);
    var hourly_rate = this.hourly_rate.reduce((a, b) => Number(a) + Number(b), 0);
    return (sum + bonus) * 2;
  }


  /**
  * Save the model
  */
  save() {
    let loader = this._loadingCtrl.create();
    loader.present();
    this.candidatesObj.forEach((value,index) => {
      this.candidates.push({
        candidate_id: value.candidate_id,
        hours: this.hours[index],
        bonus: this.bonus[index]
      });
    });
    console.log(this.candidates);
    let action
    action = this.transferService.save(this.candidates);
     action.subscribe(jsonResponse => {
      loader.dismiss();
      console.log(jsonResponse);
      // On Success
      if(jsonResponse.operation == "success"){
        // Close the page
        let data = { 'refresh': true };
        this._viewCtrl.dismiss(data);
      }

      // On Failure
      if(jsonResponse.operation == "error"){
        let prompt = this._alertCtrl.create({
          message: JSON.stringify(jsonResponse.message),
          buttons: ["Ok"]
        });
        prompt.present();
      }
    });
  } 

  //close the model
  close() {
    let data = { 'refresh': false };
    this._viewCtrl.dismiss(data);
  }

}
