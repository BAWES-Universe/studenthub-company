import { Component, ViewChild } from '@angular/core';
import { MenuController, NavController } from 'ionic-angular';

// Page Imports
import { CandidateListPage } from '../candidate/candidate-list/candidate-list';
import { TransferListPage } from '../transfer/transfer-list/transfer-list';
import { StoreListPage } from '../store/store-list/store-list';
import { CompanyListPage } from '../company/company-list/company-list';
import { ChangePassword } from '../account/change-password/change-password';

// Services
import { AuthService } from '../../../providers/auth.service';
import { CandidateService } from '../../../providers/logged-in/candidate.service';

@Component({
  selector: 'page-navigation',
  templateUrl: 'navigation.html'
})
export class NavigationPage {

  rootPage: any = TransferListPage;

  @ViewChild('loggedInContent') nav: NavController

  private totalEmployees: number = 0;

  constructor(
    private _auth: AuthService,
    private _menuCtrl: MenuController,
    private candidateService: CandidateService
  ) { 
    this.candidateService.total().subscribe(result => {
      this.totalEmployees = result;
    });
  }

  loadPage(pageName: string) {
    switch (pageName) {
      case "company":
        this.rootPage = CompanyListPage;
        break;
      case "store":
        this.rootPage = StoreListPage;
        break;
      case "candidate":
        this.rootPage = CandidateListPage;
        break;
      case "transfer":
        this.rootPage = TransferListPage;
        break;
      case "change-password":
        this.rootPage = ChangePassword;
        break;
    }
    this._menuCtrl.close();
  }


  /**
   * Log Agent out of the app
   */
  logout() {
    this._auth.logout();
  }

}
