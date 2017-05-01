import { Component } from '@angular/core';
import { NavController, ViewController, LoadingController, AlertController, NavParams } from 'ionic-angular';

// Forms
import { FormBuilder, FormGroup } from '@angular/forms';

// Models
import { Transfer } from '../../../../models/transfer';
import { TransferService } from '../../../../providers/logged-in/transfer.service';

@Component({
  selector: 'page-transfer-form',
  templateUrl: 'transfer-form.html'
})
export class TransferFormPage {

  public transfer: Transfer;
  public operation: string;
  public form: FormGroup;
  public candidatesObj;
  public invoiceCandidatesObj;
  public candidates: any = []
  public hours: any = [];
  public bonus: any = [];
  public editForm: boolean;

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
    this.transfer = params.get('model');
    this.candidatesObj = params.get('candidates')
    this.editForm = params.get('editModel');

    if (this.editForm) {
      this.invoiceCandidatesObj = this.transfer.candidates;
    }
  }

  /**
  * Save the model
  */
  save() {
    let loader = this._loadingCtrl.create();
    loader.present();
    if (this.invoiceCandidatesObj) {
      this.invoiceCandidatesObj.forEach((value, index) => {
        this.candidates.push({
          candidate_id: Number(value.candidate_id),
          hours: Number(value.hours),
          bonus: Number(value.bonus)
        });
      });

    } else {
      this.candidatesObj.forEach((value, index) => {
        this.candidates.push({
          candidate_id: value.candidate_id,
          hours: this.hours[index],
          bonus: this.bonus[index]
        });
      });

    }
    
    let action
    //Transfer Update/Edit form
    if (this.invoiceCandidatesObj)
      action = this.transferService.updateInvoice(this.candidates, Number(this.transfer.transfer_id));
    //Transfer Create form
    else
      action = this.transferService.save(this.candidates);

    action.subscribe(jsonResponse => {
      loader.dismiss();
      
      // On Success
      if (jsonResponse.operation == "success") {
        // Close the page
        let data = { 'refresh': true };
        this._viewCtrl.dismiss(data);
      }

      // On Failure
      if (jsonResponse.operation == "error") {
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
