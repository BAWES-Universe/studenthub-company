import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import {AuthService} from 'src/app/providers/auth.service';
// services

@Component({
  selector: 'app-request-sent',
  templateUrl: './request-sent.page.html',
  styleUrls: ['./request-sent.page.scss'],
})
export class RequestSentPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public scrollPosition = 0;

  public company_name: string;

  constructor(
    public _auth: AuthService,
    public _router: Router,
    public _activatedRoute: ActivatedRoute
  ) { }

  async ngOnInit() {
    window.analytics.page('Request Sent Page');

    this._activatedRoute.params.subscribe(routeParams => {
      this.company_name = routeParams.company_name;
    });
  }

  ionViewWillLeave() {
    this.content.getScrollElement().then(ele => {
      this.scrollPosition = ele.scrollTop;
    });
  }

  ionViewDidEnter() {
    this.content.scrollToPoint(0, this.scrollPosition);
  }

  /**
   * Load homepage
   */
  async loadHomePage() {
      this._router.navigate(['/']);
  }
}
