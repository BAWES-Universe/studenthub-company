import { APP_INITIALIZER, ErrorHandler, Injector, NgModule } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './providers/auth.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { environment } from '../environments/environment';
// import { IonicStorageModule, Storage } from "@ionic/storage";
import { ServiceWorkerModule, SwUpdate } from '@angular/service-worker';
import { UpdateAlertModule } from './components/update-alert/update-alert.module';
import { File } from '@ionic-native/file/ngx';
import { SentryErrorhandlerService } from './providers/sentry.errorhandler.service';
import { SelectiveLoadingStrategy } from './util/SelectiveLoadingStrategy';
import {CalendarModule} from 'ion2-calendar';
import {CompanyContactListPageModule} from './pages/logged-in/company-contact/company-contact-list/company-contact-list.module';
import {ModalPopPageModule} from './pages/logged-in/modal-pop/modal-pop.module';
import {InvitationFormPageModule} from './pages/logged-in/company/invitation/invitation-form/invitation-form.module';
import {CompanyHeaderModule} from './components/company-header/company-header.module';
import { MenuModule } from './components/menu/menu.module';
import {InvitePageModule} from './pages/logged-in/invite/invite.module';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


export function startupServiceFactory(authService) {
  return () => authService.load();
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

declare global {
  interface Window { analytics: any; }
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
    ModalPopPageModule,
    CompanyHeaderModule,
    MenuModule,
    InvitePageModule,
    InvitationFormPageModule,
    // IonicStorageModule.forRoot({
    //   name: '__payroll_company',
    //   version: 2
    //   //driverOrder: ['sqlite', 'indexeddb', 'websql', 'localstorage']
    // }),
    CompanyContactListPageModule,
    UpdateAlertModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.serviceWorker }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
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
