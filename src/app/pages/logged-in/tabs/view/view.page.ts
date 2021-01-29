import { Component, OnInit, ViewChild } from '@angular/core';
import { IonTabs, Platform, MenuController } from '@ionic/angular';
import { PreLoad } from '../../../../util/preLoad';
import { Router } from '@angular/router';
import {EventService} from 'src/app/providers/event.service';
import {AuthService} from 'src/app/providers/auth.service';

@Component({
  selector: 'student-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
// @PreLoad('SourceBrowserPage')
export class ViewPage implements OnInit {

  applicationCount: number = null;
  conversationAlert: number = null;

  @ViewChild(IonTabs, { static: true }) tabRef: IonTabs;

  @ViewChild('menu', { static: false }) menu;

  constructor(
      public platform: Platform,
      public menuCtrl: MenuController,
      public router: Router,
      public eventService: EventService,
      public auth: AuthService
  ) {
    this.eventSubscriptions();
  }

  ngOnInit() {
  }

  eventSubscriptions() {

    /**
     * remove old count new company created
    //  */
    // this.eventService.agentCompanyChanged$.subscribe(() => {
    //   this.conversationAlert = this.applicationCount = null;
    // });
    //
    // this.eventService.companyCreated$.subscribe(() => {
    //   this.conversationAlert = this.applicationCount = null;
    // });
    //
    // this.eventService.applicationCount$.subscribe((applicationCount: number) => {
    //
    //   if (this.applicationCount != applicationCount) {
    //     this.eventService.updateStats$.next();
    //   }
    //
    //   this.applicationCount = applicationCount;
    // });
    //
    // this.eventService.conversationCount$.subscribe((counts: number) => {
    //   if (counts) {
    //     this.conversationAlert = counts;
    //   } else {
    //     this.conversationAlert = null;
    //   }
    // });
  }

  ionViewWillEnter() {
    this.eventService.pageSelected$.next('view');
  }
}
