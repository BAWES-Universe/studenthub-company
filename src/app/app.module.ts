import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { IonicStorageModule } from '@ionic/storage';

// Ionic Native
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// App Imports
import { MyApp } from './app.component';

/**
 * Modules
 */
import { EnvironmentsModule } from './environments/environments.module';

// Start Pages [Logged Out]
import { LoginPage } from '../pages/start-pages/login/login';
// Pages when logged in
import { NavigationPage } from '../pages/logged-in/navigation/navigation';

import { CompanyListPage } from '../pages/logged-in/company/company-list/company-list';
import { CompanyViewPage } from '../pages/logged-in/company/company-view/company-view';
import { StoreListPage } from '../pages/logged-in/store/store-list/store-list';
import { StoreViewPage } from '../pages/logged-in/store/store-view/store-view';
import { CandidateListPage } from '../pages/logged-in/candidate/candidate-list/candidate-list';
import { CandidateViewPage } from '../pages/logged-in/candidate/candidate-view/candidate-view';
import { TransferListPage } from '../pages/logged-in/transfer/transfer-list/transfer-list';
import { TransferFormPage } from '../pages/logged-in/transfer/transfer-form/transfer-form';
import { TransferViewPage } from '../pages/logged-in/transfer/transfer-view/transfer-view';
import { ChangePassword } from '../pages/logged-in/account/change-password/change-password';

// Providers / Services
import { AuthService } from '../providers/auth.service';
import { ConfigService } from '../providers/config.service';
import { AuthHttpService } from '../providers/logged-in/authhttp.service';
import { CandidateService } from '../providers/logged-in/candidate.service';
import { TransferService } from '../providers/logged-in/transfer.service';
import { StoreService } from '../providers/logged-in/store.service';
import { CompanyService } from '../providers/logged-in/company.service';
import { AccountService } from '../providers/logged-in/account.service';

// Pipes
import { GroupByPipe } from '../pipes/groupby-pipe';
import { SortPipe } from '../pipes/timestamp-pipe';
import { StoreIdPipe } from '../pipes/store-id-pipe';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '1c2a3c7a'
  }
};

@NgModule({
  declarations: [
    MyApp,
    // Logged Out
    LoginPage,
    // Logged In
    NavigationPage,
    CompanyListPage,
    CompanyViewPage,
    StoreListPage,
    StoreViewPage,
    CandidateListPage,
    CandidateViewPage,
    TransferListPage,
    TransferFormPage,
    TransferViewPage,
    ChangePassword,
    // Pipes
    GroupByPipe,
    SortPipe,
    StoreIdPipe
  ],
  entryComponents: [
    MyApp,
    // Logged Out
    LoginPage,
    // Logged In
    NavigationPage,
    CompanyListPage,
    CompanyViewPage,
    StoreListPage,
    StoreViewPage,
    CandidateListPage,
    CandidateViewPage,
    TransferListPage,
    TransferFormPage,
    TransferViewPage,
    ChangePassword
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings),
    IonicStorageModule.forRoot(),
    // Custom Modules
    EnvironmentsModule
  ],
  providers: [
      // Ionic Native 
      StatusBar,
      SplashScreen,
      {provide: ErrorHandler, useClass: IonicErrorHandler},
      // Custom
      AuthService, // Handles all Authorization
      ConfigService, // Handles Environment-specific Variables
      CompanyService,
      StoreService,
      CandidateService,
      TransferService,
      AuthHttpService,
      AccountService
  ],
  bootstrap: [IonicApp]
})
export class AppModule {}
