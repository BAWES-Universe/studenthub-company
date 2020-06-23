import {Component, OnInit, ViewChild} from '@angular/core';
import {AlertController, IonContent, LoadingController, NavController, ToastController} from "@ionic/angular";
import {Transfer} from "../../../../models/transfer";
import {FormBuilder, FormGroup} from "@angular/forms";
import {TransferService} from "../../../../providers/logged-in/transfer.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-import-transfer-form',
  templateUrl: './import-transfer-form.page.html',
  styleUrls: ['./import-transfer-form.page.scss'],
})
export class ImportTransferFormPage implements OnInit {

  // Html Content
  @ViewChild(IonContent) content: IonContent;

  // The Transfer containing all records
  public transfer_id;
  public transfer: Transfer;
  public scenario:string = 'create';
  // The form containing entire records
  public form: FormGroup = new FormGroup({});
  // The Transfer containing all records

  // Page Title depends on Operation (Create vs Edit Transfer)
  public pageTitle: string = "Create Transfer via Excel";

  // Whether the content is ready to be displayed or not
  public ready: Boolean = false;
  public fileList : FileList;
  constructor(
      public activatedRoute: ActivatedRoute,
      public navCtrl: NavController,
      public transferService: TransferService,
      // private _viewCtrl: ViewController,
      private _loadingCtrl: LoadingController,
      private _alertCtrl: AlertController,
      public _toastCtrl:ToastController,
      private _fb: FormBuilder
  ) {
    this.transfer_id = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    const state = window.history.state;
    // Load the passed model (required)
    if (state['transfer']) {
      this.transfer = state['transfer'];
      // Update Page Title if Editing a Transfer that already exists in backend
      if(this.transfer.transfer_id) this.pageTitle = "Edit Transfer via Excel";
      this.scenario = 'update'
    }
    if (!this.transfer && this.transfer_id) {
      this.loadTransferData();
    }
  }

  /**
   * upload excel transfer
   * @param event
   */
  uploadExcelTransfer(event) {
    this.fileList = event.target.files;
  }

  upload() {
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
  async newTransferUpload(event) {

    if(this.fileList.length == 0) {
      return false;
    }

    let loader = await this._loadingCtrl.create();
    let data;
    loader.present();
    this.transferService.uploadTransferExcel(this.fileList).subscribe(async jsonResponse => {
      loader.dismiss();
      data = jsonResponse;

      if(data.operation == 'success') {

        let prompt = await this._alertCtrl.create({
          message: data.message,
          buttons: ["Ok"]
        });
        prompt.present();

        this.navCtrl.navigateBack('transfer-view/'+data.transfer_id, {
          state : {
            model: data.transfer_id
          }
        });
        // this.navCtrl.push(TransferViewPage, {
        //   'model': data.transfer_id
        // });
      }

      // On Failure
      if (data.operation == "error") {
        var html = '';
        if(data.type){
          for (let i in data.message) {
            for (let j of data.message[i]) {
              html += j + '<br />';
            }
          }
        } else {
          html = data.message;
        }

        let prompt = await this._alertCtrl.create({
          message: html,
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
  async editTransferUpload(event) {
    if(this.fileList.length == 0) {
      return false;
    }

    let loader = await this._loadingCtrl.create();
    let data;
    loader.present();
    this.transferService
        .updateTransferUploadExcel(this.fileList,this.transfer.transfer_id)
        .subscribe(async jsonResponse => {
      loader.dismiss();
      data = jsonResponse;

      if(data.operation == 'success') {

        let prompt = await this._alertCtrl.create({
          message: data.message,
          buttons: ["Ok"]
        });
        prompt.present();

        this.navCtrl.navigateForward('transfer-view/'+this.transfer.transfer_id,{
          state : {
            model: this.transfer.transfer_id
          }
        })
        // this.navCtrl.push(TransferViewPage, {
        //   'model': this.transfer.transfer_id
        // });
      }

      // On Failure
      if (data.operation == "error") {
        var html = '';
        if(data.type){
          for (let i in data.message) {
            for (let j of data.message[i]) {
              html += j + '<br />';
            }
          }
        } else {
          html = data.message;
        }

        let prompt = await this._alertCtrl.create({
          message: html,
          buttons: ["Ok"]
        });
        prompt.present();
      }
    });
  }

  /**
   * download transfer template invoice
   */
  async downloadTemplate() {
    let loader = await this._loadingCtrl.create();
    loader.present();
    this.transferService.downloadTransferTemplate().subscribe(response => {
      loader.dismiss();
    });
  }

  async loadTransferData() {
    // Load list of transfer
    let loader = await this._loadingCtrl.create();
    loader.present();
    this.transferService.transferIdDetails(this.transfer_id).subscribe(response => {
      this.transfer = response;
      // Update Page Title if Editing a Transfer that already exists in backend
      this.pageTitle = "Edit Transfer via Excel";
      this.scenario = 'update'
      loader.dismiss();
    });
  }
}
