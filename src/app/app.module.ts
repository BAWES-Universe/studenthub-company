import { APP_INITIALIZER, ErrorHandler, Injector, NgModule } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './providers/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
// import { IonicStorageModule, Storage } from "@ionic/storage";
import { ServiceWorkerModule, SwUpdate } from '@angular/service-worker';
import { UpdateAlertModule } from './components/update-alert/update-alert.module';
import { File } from '@ionic-native/file/ngx';
import { SentryErrorhandlerService } from './providers/sentry.errorhandler.service';
import { SelectiveLoadingStrategy } from './util/SelectiveLoadingStrategy';
import {CalendarModule} from 'ion2-calendar';
import {CompanyContactListPageModule} from "./pages/logged-in/company-contact/company-contact-list/company-contact-list.module";




export function startupServiceFactory(authService) {
  return () => authService.load();
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    BrowserTransferStateModule,
    CalendarModule,
    // IonicStorageModule.forRoot({
    //   name: '__payroll_company',
    //   version: 2
    //   //driverOrder: ['sqlite', 'indexeddb', 'websql', 'localstorage']
    // }),
    CompanyContactListPageModule,
    UpdateAlertModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.serviceWorker }),
  ],
  providers: [
    {
      // Provider for APP_INITIALIZER
      provide: APP_INITIALIZER,
      useFactory: startupServiceFactory,
      deps: [AuthService],
      multi: true
    },
    File,
    SwUpdate,
    SelectiveLoadingStrategy,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: ErrorHandler, useClass: SentryErrorhandlerService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  static injector: Injector;

  constructor(public injector: Injector) {
    AppModule.injector = injector;
  }
}
