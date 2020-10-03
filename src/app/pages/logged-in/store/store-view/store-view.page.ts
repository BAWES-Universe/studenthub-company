import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
// models
import { Store } from '../../../../models/store';
// services
import { StoreService } from '../../../../providers/logged-in/store.service';
import { AwsService } from 'src/app/providers/aws.service';


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
    public aws: AwsService,
    public storeService: StoreService,
    private _loadingCtrl: LoadingController
  ) {
    this.store_id = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    const state = window.history.state;
    if (state.model) {
      this.store = state.model;
    }

    if (!this.store) {
      this.loadData();
    }
  }

  async loadData() {
    const loader = await this._loadingCtrl.create();
    loader.present();
    this.storeService.view(this.store_id).subscribe(result => {
      loader.dismiss();
      if (!result) {
        this.navCtrl.back();
      }
      this.store = result;
    });
  }

  /**
   * Load Detail Page
   */
  candidateSelected(model) {
    this.navCtrl.navigateForward('candidate-view/' + model.candidate_id, {
      state: {
        model
      }
    });
  }
  
  onImageError(candidate) {
    candidate.candidate_personal_photo = null;
  }
}

