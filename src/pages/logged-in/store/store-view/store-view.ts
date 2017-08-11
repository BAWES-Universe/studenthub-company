import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

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
    params: NavParams
  ) {
    this.store = params.get('model');
  }

  /**
   * Load Detail Page
   */
  candidateSelected(model) {
    this.navCtrl.push(CandidateViewPage, {
      'model': model
    });
  }

}
