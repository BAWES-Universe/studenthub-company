import { Component, OnInit } from '@angular/core';
import { ToastController, NavController, LoadingController, ModalController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import {TranslateLabelService} from "../../../providers/translate-label.service";


const { Storage } = Plugins;

@Component({
  selector: 'pogi-app-error',
  templateUrl: './app-error.page.html',
  styleUrls: ['./app-error.page.scss'],
})
export class AppErrorPage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    public translateLabelService: TranslateLabelService
  ) { }

  ngOnInit() {
    window.analytics.page('App Error Page');
  }

  ionViewWillEnter() {
    this.modalCtrl.getTop().then(overlay => {
      if (overlay) {
        overlay.dismiss();
      }
    });

    this.loadingCtrl.getTop().then(overlay => {
      if (overlay) {
        overlay.dismiss();
      }
    });
  }

  /**
   * Open home page
   */
  async home() {

    Storage.get({ key: 'loggedInUser' }).then(ret => {

      this.navCtrl.navigateRoot('/');
    }).catch(r => {

      this.toastCtrl.create({
        message: this.translateLabelService.transform('Please, enable cookies/ storage.'),
        duration: 3000,
      }).then(toast => toast.present());
    });
  }
}
