import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { MyApp } from './app.component';

// Start Pages [Logged Out]
import { LoginPage } from '../pages/start-pages/login/login';
// Pages when logged in
import { NavigationPage } from '../pages/logged-in/navigation/navigation';
import { HomePage } from '../pages/logged-in/home/home';
import { CandidateListPage } from '../pages/logged-in/candidate/candidate-list/candidate-list';
import { CandidateViewPage } from '../pages/logged-in/candidate/candidate-view/candidate-view';
import { TransferListPage } from '../pages/logged-in/transfer/transfer-list/transfer-list';
import { TransferFormPage } from '../pages/logged-in/transfer/transfer-form/transfer-form';
import { TransferViewPage } from '../pages/logged-in/transfer/transfer-view/transfer-view';

// Providers / Services
import { AuthService } from '../providers/auth.service';
import { ConfigService } from '../providers/config.service';
import { AuthHttpService } from '../providers/logged-in/authhttp.service';
import { CandidateService } from '../providers/logged-in/candidate.service';
import { TransferService } from '../providers/logged-in/transfer.service';


import { GroupByPipe } from '../pages/logged-in/transfer/groupby-pipe';
import { SortPipe } from '../pages/logged-in/transfer/timestamp-pipe';




@NgModule({
  declarations: [
    MyApp,
    // Logged Out
    LoginPage,
    // Logged In
    NavigationPage,
    HomePage,
    CandidateListPage,
    CandidateViewPage,
    TransferListPage,
    TransferFormPage,
    TransferViewPage,
    GroupByPipe,
    SortPipe
  ],
  entryComponents: [
    MyApp,
    // Logged Out
    LoginPage,
    // Logged In
    NavigationPage,
    HomePage,
    CandidateListPage,
    CandidateViewPage,
    TransferListPage,
    TransferFormPage,
    TransferViewPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  providers: [
      {provide: ErrorHandler, useClass: IonicErrorHandler},
      Storage, // Ionic Storage
      AuthService, // Handles all Authorization
      ConfigService, // Handles Environment-specific Variables
      CandidateService,
      TransferService,
      AuthHttpService
  ],
  bootstrap: [IonicApp]
})
export class AppModule {}
