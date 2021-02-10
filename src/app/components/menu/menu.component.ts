import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
//services
import { AuthService } from 'src/app/providers/auth.service';
import { AwsService } from 'src/app/providers/aws.service';
import { EventService } from 'src/app/providers/event.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  constructor(
    private _menuCtrl: MenuController,
    public navCtrl: NavController,
    public awsService: AwsService,
    public eventService: EventService,
    public auth: AuthService
  ) { }

  ngOnInit() {
    
  }

  /**
   * change company request
   * @param employer
   */
  changeCompany(employer) {

    this._menuCtrl.close();

    this.resetCompanyDetail(employer);
    
    this.navCtrl.navigateRoot(['/']);

    this.eventService.companyChanged$.next({
     employer
    });
  }

  /**
   * reset company detail
   */
  async resetCompanyDetail(employer) {
    this.auth.setEmployer(employer);

    /*clearInterval(this.alertSubscription);

    this.alertSubscription = null;

    if (employer) {
      this.alertSubscribe();
    }*/
  }

  closeMenu() {
    this._menuCtrl.close();
  }
}
