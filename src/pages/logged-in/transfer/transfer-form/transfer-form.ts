import { Component } from '@angular/core';
import { NavController, ViewController, LoadingController, AlertController, NavParams,ToastController } from 'ionic-angular';

// Forms
import { FormBuilder, FormGroup } from '@angular/forms';

// Models
import { Transfer } from '../../../../models/transfer';
import { Candidate } from '../../../../models/candidate';

// Services
import { TransferService } from '../../../../providers/logged-in/transfer.service';
import { CandidateService } from '../../../../providers/logged-in/candidate.service';

@Component({
  selector: 'page-transfer-form',
  templateUrl: 'transfer-form.html'
})
export class TransferFormPage {
  public transfer: Transfer;
  public operation: string;

  public allCandidatesAssignedToCompany: Candidate[];

  public hours: any = [];
  public bonus: any = [];

  // Doesn't seem to be in use
  public form: FormGroup;

  constructor(
    params: NavParams,
    public navCtrl: NavController,
    public transferService: TransferService,
    public candidateService: CandidateService,
    private _viewCtrl: ViewController,
    private _fb: FormBuilder,
    private _loadingCtrl: LoadingController,
    private _alertCtrl: AlertController,
    public _toastCtrl:ToastController
  ) {
    // Load the passed model if available
    this.transfer = params.get('model');

    // Load List of All Candidates Assigned to this Company
    this._loadCandidateListThenInitialize();
  }

  /**
   * Load List of All Candidates Assigned to this Company
   * Initialise the form once loaded.
   */
  private _loadCandidateListThenInitialize(){
    let loader = this._loadingCtrl.create();
    loader.present();

    this.candidateService.list().subscribe(response => {
      this.allCandidatesAssignedToCompany = response;
      this._init();
      loader.dismiss();
    });
  }

  /**
   * Initialize the page.
   */
  private _init(){
    // Get previous hours and bonus values from the Transfer if we are editing an existing transfer 
    if (this.transfer.transferCandidates) {
      var data = {};
      for(let candidate of this.transfer.transferCandidates) {        
        data['candiate-' + candidate.candidate_id] = [];
        data['candiate-' + candidate.candidate_id]['hours'] = candidate.hours;
        data['candiate-' + candidate.candidate_id]['bonus'] = candidate.bonus;
      }

      let i = 0;
      for(let j of this.allCandidatesAssignedToCompany) {
        if(data['candiate-' + j.candidate_id]) {
          this.hours[i] = data['candiate-' + j.candidate_id]['hours'];
          this.bonus[i] = data['candiate-' + j.candidate_id]['bonus'];
        }
        i++;        
      }
    }
  }

  /**
  * Save the model
  */
  save() {
    let loader = this._loadingCtrl.create();
    loader.present();

    let candidatesToSendToServer: any = [];

    this.allCandidatesAssignedToCompany.forEach((value, index) => {
      candidatesToSendToServer.push({
        candidate_id: value.candidate_id,
        hours: this.hours[index],
        bonus: this.bonus[index]
      });
    });
    
    /**
     * Update the transfer data if it already exists
     * Otherwise create a new transfer
     */
    let action = this.transfer.transfer_id? 
        this.transferService.updateInvoice(candidatesToSendToServer, Number(this.transfer.transfer_id)) :
        this.transferService.save(candidatesToSendToServer);

    action.subscribe(jsonResponse => {
      loader.dismiss();
      
      // On Success
      if (jsonResponse.operation == "success") {
        // Close the page

        let toast = this._toastCtrl.create({
          message: jsonResponse.message,
          duration: 3000
        });
        toast.present();

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

  /**
   * Cast value to integer, return 0 by default
   * @param value 
   */
  parseNumber(value){
    if(!value) return 0;
    return Number(value);
  }

  /**
   * Close the Modal / View
   */
  close() {
    let data = { 'refresh': false };
    this._viewCtrl.dismiss(data);
  }

}
