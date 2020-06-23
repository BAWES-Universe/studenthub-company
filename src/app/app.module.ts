import {APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {AuthService} from "./providers/auth.service";
import {HttpClientModule} from "@angular/common/http";
import {environment} from "../environments/environment";
import {IonicStorageModule, Storage} from "@ionic/storage";


// export function startupServiceFactory(authService, storage) {
//   if (typeof authService != 'undefined') {
//     return authService.load();
//   }
//   return () => {};
// }

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot({
      name: '__payroll_company',
      version: 2
      //driverOrder: ['sqlite', 'indexeddb', 'websql', 'localstorage']
    }),
  ],
  providers: [
    // {
    //   // Provider for APP_INITIALIZER
    //   provide: APP_INITIALIZER,
    //   useFactory: startupServiceFactory,
    //   deps: [AuthService, Storage],
    //   multi: true
    // },
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
