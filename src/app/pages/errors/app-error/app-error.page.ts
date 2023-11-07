import { Component, OnInit } from '@angular/core';
import { ToastController, NavController, LoadingController, ModalController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import {TranslateLabelService} from "../../../providers/translate-label.service";
import { AnalyticsService } from 'src/app/providers/analytics.service';


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
    public translateLabelService: TranslateLabelService,
    public analyticService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticService.page('App Error Page');
  }

  ionViewWillLeave() {
    this.analyticService.track('page_exit', {
      'page': 'App Error page'
    });
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

    Preferences.get({ key: 'loggedInUser' }).then(ret => {

      this.navCtrl.navigateRoot('/');
    }).catch(r => {

      this.toastCtrl.create({
        message: this.translateLabelService.transform('Please, enable cookies/ storage.'),
        duration: 3000,
      }).then(toast => toast.present());
    });
  }
}
