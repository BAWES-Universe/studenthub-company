import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
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

  public loading: boolean = false;

  constructor(
    public navCtrl: NavController,
    public activatedRoute: ActivatedRoute,
    public awsService: AwsService,
    public storeService: StoreService
  ) {
  }

  ngOnInit() {

    this.store_id = this.activatedRoute.snapshot.paramMap.get('id');

    const state = window.history.state;

    if (state.model) {
      this.store = state.model;
    }

    this.loadData();
  }

  async loadData() {
    
    this.loading = true;

    this.storeService.view(this.store_id).subscribe(result => {
      this.loading = false;

      if (!result) {
        this.navCtrl.back();
      }

      this.store = result;
    }, () => {
      this.loading = false;
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

