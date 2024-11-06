import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//models
import { Contract } from 'src/app/models/contract';
//services
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { ContractService } from 'src/app/providers/logged-in/contract.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';


@Component({
  selector: 'app-contract-view',
  templateUrl: './contract-view.page.html',
  styleUrls: ['./contract-view.page.scss'],
})
export class ContractViewPage implements OnInit {

  id: string; 

  contract: Contract;

  public borderLimit;
  
  public loading = false;

  constructor(     
    public translateService: TranslateLabelService,
    public activatedRoute: ActivatedRoute,
    public contractService: ContractService,
    public analyticService: AnalyticsService
  ) {
  }

  ngOnInit() {

    this.analyticService.page('Contract View Page');

    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    
    this.loadData();
  }

  ionViewWillLeave() {
    this.analyticService.track('page_exit', {
      'page': 'Contract View Page'
    });  
  }

  ionViewWillEnter() {
    if (history.state && history.state.refresh) {
      this.loadData();
    }
  }

  async loadData() {
   
    this.loading = true;

    this.contractService.view(this.id).subscribe(response => {
      
      this.contract = response;

      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
