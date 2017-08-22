import { Component, ViewChild } from '@angular/core';
import { NavController, ViewController, LoadingController, AlertController, NavParams, ToastController } from 'ionic-angular';
import { Content } from 'ionic-angular';

// Forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidator } from '../../../../validators/custom.validator';

// Services
import { TransferService } from '../../../../providers/logged-in/transfer.service';

//Pages
import { TransferViewPage } from '../transfer-view/transfer-view';

// Models
import { Transfer } from '../../../../models/transfer';

@Component({
  selector: 'page-import-transfer-form',
  templateUrl: 'import-transfer-form.html'
})
export class ImportTransferFormPage {
  // Html Content
  @ViewChild(Content) content: Content;

  // The Transfer containing all records
  public transfer: Transfer;
  public scenario:string = 'create';
  // The form containing entire records
  public form: FormGroup = new FormGroup({});
  // The Transfer containing all records
  
  // Page Title depends on Operation (Create vs Edit Transfer)
  public pageTitle: string = "New Transfer Import";

  // Whether the content is ready to be displayed or not
  public ready: Boolean = false;

  constructor(
    params: NavParams,
    public navCtrl: NavController,
    public transferService: TransferService,
    private _viewCtrl: ViewController,
    private _loadingCtrl: LoadingController,
    private _alertCtrl: AlertController,
    public _toastCtrl:ToastController,
    private _fb: FormBuilder
  ) { 

    // Load the passed model (required)
    if (params.get('transfer')) {
      this.transfer = params.get('transfer');
  
      // Update Page Title if Editing a Transfer that already exists in backend
      if(this.transfer.transfer_id) this.pageTitle = "Edit Transfer by upload excel";
      this.scenario = 'update'
    }
  }

  /**
   * upload excel transfer
   * @param event 
   */
	uploadExcelTransfer(event) {
    if (this.scenario == 'update') {
      this.editTransferUpload(event);
    } else {
      this.newTransferUpload(event);
    }
  }
  
  /**
   * new transfer upload excel
   * @param event 
   */
  newTransferUpload(event) {
    let fileList: FileList = event.target.files;
    
    if(fileList.length == 0) {
      return false;
    }
    
    let loader = this._loadingCtrl.create();
    let data;
    loader.present();
    this.transferService.uploadTransferExcel(fileList).subscribe(jsonResponse => {
      loader.dismiss();
      data = jsonResponse;
      
      if(data.operation == 'success') {

        let prompt = this._alertCtrl.create({
          message: data.message,
          buttons: ["Ok"]
        });
        prompt.present();
        
        this.navCtrl.push(TransferViewPage, {
          'model': data.transfer_id
        });
      }

      // On Failure
      if (data.operation == "error") {
        var html = '';
        let prompt = this._alertCtrl.create({
          message: data.message,
          buttons: ["Ok"]
        });
        prompt.present();
      }
    });
  }

  /**
   * edit transfer upload excel
   * @param event 
   */
  editTransferUpload(event) {
    let fileList: FileList = event.target.files;
    
    if(fileList.length == 0) {
      return false;
    }
    
    let loader = this._loadingCtrl.create();
    let data;
    loader.present();
    this.transferService.updateTransferUploadExcel(fileList,this.transfer.transfer_id).subscribe(jsonResponse => {
      loader.dismiss();
      data = jsonResponse;
      
      if(data.operation == 'success') {

        let prompt = this._alertCtrl.create({
          message: data.message,
          buttons: ["Ok"]
        });
        prompt.present();
        
        this.navCtrl.push(TransferViewPage, {
          'model': this.transfer.transfer_id
        });
      }

      // On Failure
      if (data.operation == "error") {
        var html = '';
        
        let prompt = this._alertCtrl.create({
          message: data.message,
          buttons: ["Ok"]
        });
        prompt.present();
      }
    });
  }


  /**
   * download transfer template invoice
   */
  downloadTemplate() {
    let loader = this._loadingCtrl.create();
    loader.present();
    this.transferService.downloadTransferTemplate().subscribe(response => {
      loader.dismiss();
    });
  }
}
