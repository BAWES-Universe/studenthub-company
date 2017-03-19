import { Component } from '@angular/core';
import { NavController, ViewController, LoadingController, AlertController, NavParams } from 'ionic-angular';
// Forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidator } from '../../../../validators/custom.validator';
// // Providers
// import { CandidateService } from '../../../../providers/logged-in/candidate.service';
// import { BankService } from '../../../../providers/logged-in/bank.service';

// Models
import { Transfer } from '../../../../models/transfer';
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
  public candidates: any = []
  public hours: any = [];
  public bonus: any = [];
  // public transferObj = [{hours:0,bonus:0}];

  constructor(
    params: NavParams,
    public navCtrl: NavController,
    public transferService: TransferService,
    private _viewCtrl: ViewController,
    private _fb: FormBuilder,
    private _loadingCtrl: LoadingController,
    private _alertCtrl: AlertController,
  ) {

    // this.form = this._fb.group({
    //   });

    // Load the passed model if available
    this.model = params.get('model');
    this.candidatesObj = params.get('candidates') 
  }
  
  /**
   * Total Hours in KD
   */
  totalHours() {
    var sum = this.hours.reduce((a, b) => parseInt(a) + parseInt(b), 0); 
    return sum*2;
  }


   /**
   * Save the model
   */
  save(){
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
