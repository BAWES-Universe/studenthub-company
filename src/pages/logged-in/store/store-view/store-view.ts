import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams } from 'ionic-angular';

//Services 
import { StoreService } from '../../../../providers/logged-in/store.service';

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
    params: NavParams,
    public storeService: StoreService,
    private _loadingCtrl: LoadingController
  ) {
    this.store = params.get('model');
  }

  ionViewDidLoad() {
    if(!this.store.candidates)
      this.loadData();
  }

  loadData() {
    let loader = this._loadingCtrl.create();
    loader.present();
    this.storeService.view(this.store.store_id).subscribe(result => {
      loader.dismiss();
      this.store.candidates = result[0].candidates;
    });
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
