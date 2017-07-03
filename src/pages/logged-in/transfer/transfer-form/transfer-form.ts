import { Component } from '@angular/core';
import { NavController, ViewController, LoadingController, AlertController, NavParams,ToastController } from 'ionic-angular';
// Models
import { Transfer } from '../../../../models/transfer';
import { Candidate } from '../../../../models/candidate';
// Services
import { TransferService } from '../../../../providers/logged-in/transfer.service';
import { CandidateService } from '../../../../providers/logged-in/candidate.service';
//Pages
import { TransferViewPage } from '../transfer-view/transfer-view';

@Component({
  selector: 'page-transfer-form',
  templateUrl: 'transfer-form.html'
})
export class TransferFormPage {
  public transfer: Transfer;

  // List of All Candidates Assigned to Work for Company
  public allCandidatesAssignedToCompany: Candidate[];

  // Page Title depends on Operation (Create vs Edit Transfer)
  public pageTitle: string = "New Transfer";

  // Used to map hours and bonus input fields then send to server
  public hours: any = [];
  public bonus: any = [];

  // Total Price for Transfer
  public total: number = 0;
  public companyHourlyCost: number = 2;

  constructor(
    params: NavParams,
    public navCtrl: NavController,
    public transferService: TransferService,
    public candidateService: CandidateService,
    private _viewCtrl: ViewController,
    private _loadingCtrl: LoadingController,
    private _alertCtrl: AlertController,
    public _toastCtrl:ToastController
  ) {
    // Load the passed model (required)
    this.transfer = params.get('model');
    if(!this.transfer){
      throw new Error('Transfer model is required to load the transfer form page. Either pass in an existing Transfer model or send a new Transfer() model');
    }

    // Update Page Title if Editing a Transfer that already exists in backend
    if(this.transfer.transfer_id) this.pageTitle = "Edit Transfer";

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

    // Calculate the total price
    this.calculateTotal();
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
        this.transferService.updateTransfer(candidatesToSendToServer, Number(this.transfer.transfer_id)) :
        this.transferService.save(candidatesToSendToServer);

    action.subscribe(jsonResponse => {
      loader.dismiss();
      
      // On Success. Show Toast with the response message and close the page
      if (jsonResponse.operation == "success") {
        let toast = this._toastCtrl.create({
          message: jsonResponse.message,
          duration: 3000
        });
        toast.present();
        this.close();

        //create mode
        if(!this.transfer.transfer_id){
          this.navCtrl.push(TransferViewPage, {
            'model': jsonResponse.transfer_id
          });
        }
      }

      // On Failure, show an alert with the error message
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
   * Total Price Calculation based on Input Hours
   * Call this function whenever you need to re-calculate the price
   */
  calculateTotal(){
    let priceForHours = this.hours.reduce((a, b) => a + b, 0) * this.companyHourlyCost;
    let priceForBonus = this.bonus.reduce((a, b) => a + b, 0);

    this.total = priceForHours + priceForBonus;
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
   * Close the Page
   */
  close() {
    let data = { 'refresh': false };
    this._viewCtrl.dismiss(data);
  }

}
