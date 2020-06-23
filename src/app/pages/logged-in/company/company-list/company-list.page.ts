import { Component, OnInit } from '@angular/core';
import {LoadingController, NavController, NavParams} from "@ionic/angular";

//model
import {Company} from "src/app/models/company";

//service
import {CompanyService} from "src/app/providers/logged-in/company.service";

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.page.html',
  styleUrls: ['./company-list.page.scss'],
})
export class CompanyListPage implements OnInit {

  public pageCount = 0;
  public currentPage = 1;
  public pages: number[] = [];

  public companies: Company[];

  constructor(
      public navCtrl: NavController,
      public companyService: CompanyService,
      private _loadingCtrl: LoadingController
  ) {
  }

  ngOnInit() {
      this.loadData(this.currentPage);
  }

  async loadData(page: number) {

    this.companies = [];
    let loader = await this._loadingCtrl.create();
    loader.present();
    this.companyService.list(page).subscribe(response => {
        loader.dismiss();
        this.pageCount = response.headers.get('X-Pagination-Page-Count');
        this.currentPage = response.headers.get('X-Pagination-Current-Page');

        this.pages = [];

        for(var i = 1; i <= this.pageCount; i++){
            this.pages.push(i);
        }

        //hide if no page = 1

        if(this.pageCount == 1)
        this.pages = [];

        this.companies = response.body;

    },
    error => {},
    () => {loader.dismiss();}
    );
  }

  pageLinkColor(page: number) {

    if(page == this.currentPage)
      return 'light';

    return '';
  }

  rowSelected(model) {

    // Load Detail Page
    this.navCtrl.navigateForward('company-view/'+model.company_id,{
        state : {
            model: model
        }
    });
    // this.navCtrl.navigateForward(CompanyViewPage, {
    //   'model': model
    // });
  }

}
