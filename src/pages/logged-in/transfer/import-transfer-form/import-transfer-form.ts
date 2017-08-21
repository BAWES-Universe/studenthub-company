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

@Component({
  selector: 'page-import-transfer-form',
  templateUrl: 'import-transfer-form.html'
})
export class ImportTransferFormPage {
  // Html Content
  @ViewChild(Content) content: Content;

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
  ) { }

  /**
   * 
   * @param event 
   */

	uploadResume(event) {
    let fileList: FileList = event.target.files;
    
    if(fileList.length == 0) {
      return false;
    }
    
    let loader = this._loadingCtrl.create();
    let data;
    loader.present();

    this.transferService.uploadResume(fileList).subscribe(jsonResponse => {
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

        for (let i in data.message) {
          for (let j of data.message[i]) {
             html += j + '<br />';
          }
        }

        let prompt = this._alertCtrl.create({
          message: html,
          buttons: ["Ok"]
        });
        prompt.present();
      }
    });
  }
}
