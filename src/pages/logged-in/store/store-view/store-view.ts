import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';

// Models
import { Store } from '../../../../models/store';

// Pages
import { CandidateViewPage } from '../../candidate/candidate-view/candidate-view';

@Component({
  selector: 'page-store-view',
  templateUrl: 'store-view.html'
})
export class StoreViewPage {

  public store: Store;

  constructor(
    public navCtrl: NavController,
    private _modalCtrl: ModalController,
    params: NavParams,
    private _loadingCtrl: LoadingController,
  ) {
    this.store = params.get('model');
  }

  candidateSelected(model) {
    
    // Load Detail Page
    this.navCtrl.push(CandidateViewPage, {
      'model': model
    });
  }

}
