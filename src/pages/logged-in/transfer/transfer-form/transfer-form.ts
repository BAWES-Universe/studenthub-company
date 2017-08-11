import { Component, ViewChild } from '@angular/core';
import { NavController, ViewController, LoadingController, AlertController, NavParams, ToastController } from 'ionic-angular';
import { Content } from 'ionic-angular';

// Forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidator } from '../../../../validators/custom.validator';

// Models
import { Transfer } from '../../../../models/transfer';
import { Candidate } from '../../../../models/candidate';
import { TransferCandidate } from '../../../../models/transfer-candidate';

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
  // Html Content
  @ViewChild(Content) content: Content;

  // The form containing entire records
  public form: FormGroup = new FormGroup({});
  // The Transfer containing all records
  public transfer: Transfer;

  // Page Title depends on Operation (Create vs Edit Transfer)
  public pageTitle: string = "New Transfer";

  // Total Price for Transfer
  public total: number = 0;
  public companyHourlyCost: number = 2;

  // Whether the content is ready to be displayed or not
  public ready: Boolean = false;

  constructor(
    params: NavParams,
    public navCtrl: NavController,
    public transferService: TransferService,
    public candidateService: CandidateService,
    private _viewCtrl: ViewController,
    private _loadingCtrl: LoadingController,
    private _alertCtrl: AlertController,
    public _toastCtrl:ToastController,
    private _fb: FormBuilder
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
      let allCandidatesAssignedToCompany: Candidate[] = response;
      this._initTransferCandidateList(allCandidatesAssignedToCompany);
      loader.dismiss();
    });
  }

  /**
   * Initialize the TransferCandidate list required for this transfer.
   * @param { Candidate[] } allCandidatesAssignedToCompany 
   */
  private _initTransferCandidateList(allCandidatesAssignedToCompany: Candidate[]){
    let allTransferCandidateRecordsMapped: TransferCandidate[] = [];

    // Map all candidate records to an empty TransferCandidate record for a new transfer.
    allCandidatesAssignedToCompany.forEach((candidate: Candidate) => {
      let candidateTransferRecord = new TransferCandidate;
      candidateTransferRecord.candidate = candidate;
      candidateTransferRecord.candidate_id = candidate.candidate_id;

      // Append the candidateTransferRecord into the allTransferCandidateRecordsMapped array
      allTransferCandidateRecordsMapped[candidate.candidate_id] = candidateTransferRecord;
    });    

    // If we are editing an existing transfer
    // 1) Get previous hours and bonus values from the Transfer  
    // 2) Overwrite them into the allTransferCandidateRecordsMapped mapped
    if(this.transfer && this.transfer.transferCandidates){
      this.transfer.transferCandidates.forEach((transferCandidate: TransferCandidate) => {

        // Only overwrite existing records based on currently assigned employees
        // (This is for the case where a that was available during the draft got unassigned)
        if(allTransferCandidateRecordsMapped[transferCandidate.candidate_id]){
          allTransferCandidateRecordsMapped[transferCandidate.candidate_id] = transferCandidate;
        }
      });
    }

    // Re-index the TransferCandidate list to avoid issues array length and create required FormControls
    let updatedTransferRecords = [];
    let formControls: any = {};
    allTransferCandidateRecordsMapped.forEach(record => {
      updatedTransferRecords.push(record);

      // Create Form Controls with validation for this TransferCandidate record
      formControls['hours[' + record.candidate.candidate_id + ']'] = [record.hours, [
        Validators.required,
        CustomValidator.negativeNumberValidator
      ]];
      formControls['bonus[' + record.candidate.candidate_id + ']'] = [record.bonus, [
        CustomValidator.negativeNumberValidator
      ]];
    });
    // Replace the transferCandidates within the transfer with our up to date list
    this.transfer.transferCandidates = updatedTransferRecords;

    // Setup the form to use our form controls
    this.form = this._fb.group(formControls);

    // Calculate transfer total
    this.calculateTotal();

    this.ready = true;
  }

  /**
   * Validate candidate data before submit 
   */
  validate() {
    let error = '';

    for (let entry of this.transfer.transferCandidates) {
      // Check if any candidates have unset hours or 0 hours set
      if(!entry.hours || entry.hours == 0) 
        error = "You have set that some employees haven't worked any hours. Are you sure?";

      // Check if any candidates have worked more than 180 hours
      if(entry.hours > 180) 
        error = 'You have employees set to have worked for more than 180 hours. are you sure?';

      // Prompt to show user where error is or Save if he knows about it.
      if(error) {   
        let prompt = this._alertCtrl.create({
          message: error,
          buttons: [
            {
              text: 'Show me where',
              role: 'cancel',
              handler: () => {
                this.scrollTo('candidate_' + entry.candidate_id);                                
              }
            },
            {
              text: 'Yes',
              role: 'cancel',
              handler: () => {
                this.save();
              }
            }
          ]
        });
        prompt.present();        
        break; // Exit the loop
      }
    }

    // Save if there are no errors
    if(!error)
      this.save();
  }

  /**
  * Save the model
  */
  save() {
    let loader = this._loadingCtrl.create();
    loader.present();
    
    /**
     * Update the transfer data if it already exists
     * Otherwise create a new transfer
     */
    let action = this.transfer.transfer_id? 
        this.transferService.updateTransfer(this.transfer) :
        this.transferService.save(this.transfer);

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
   * Calculate the transfer total based on data input
   */
  calculateTotal() {
    this.total = 0;
    this.transfer.transferCandidates.forEach((transferCandidate: TransferCandidate) => {
      let hours = this.parseNumber(transferCandidate.hours);
      let bonus = this.parseNumber(transferCandidate.bonus);
      this.total += (hours * this.companyHourlyCost) + bonus;
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
   * Scroll to element on page by ID
   * @param element 
   */
  scrollTo(element:string) {
    let yOffset = document.getElementById(element).offsetTop;
    this.content.scrollTo(0, yOffset, 1000)
  }

  /**
   * Close the Page
   */
  close() {
    let data = { 'refresh': false };
    this._viewCtrl.dismiss(data);
  }

}
