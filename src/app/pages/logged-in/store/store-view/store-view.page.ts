import { Component, OnInit } from '@angular/core';
import {LoadingController, NavController} from "@ionic/angular";
import {Store} from "../../../../models/store";
import {StoreService} from "../../../../providers/logged-in/store.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-store-view',
  templateUrl: './store-view.page.html',
  styleUrls: ['./store-view.page.scss'],
})
export class StoreViewPage implements OnInit {

  public store: Store;
  public store_id;

  constructor(
      public navCtrl: NavController,
      public activatedRoute: ActivatedRoute,
      public storeService: StoreService,
      private _loadingCtrl: LoadingController
  ) {
    this.store_id = this.activatedRoute.snapshot.paramMap.get('id');
    // this.store = params.get('model');
  }

  ngOnInit() {
    const state = window.history.state;
    if (state['model']) {
      this.store = state['model'];
    }

    if(!this.store) {
      this.loadData();
    }
  }

  async loadData() {
    let loader = await this._loadingCtrl.create();
    loader.present();
    this.storeService.view(this.store_id).subscribe(result => {
      loader.dismiss();
      this.store = result;
    });
  }

  /**
   * Load Detail Page
   */
  candidateSelected(model) {
    this.navCtrl.navigateForward('candidate-view/'+model.candidate_id,{
      state :{
        model: model
      }
    });
  }
}

