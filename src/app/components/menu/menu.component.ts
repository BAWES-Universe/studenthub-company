import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
//services
import { AuthService } from 'src/app/providers/auth.service';
import { AwsService } from 'src/app/providers/aws.service';
import { resolvedStoredImageUrl } from 'src/app/providers/stored-image-url';
import { Company } from 'src/app/models/company';
import { EventService } from 'src/app/providers/event.service';
import {TranslateLabelService} from "../../providers/translate-label.service";


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  public totalUnread;

  constructor(
    private _menuCtrl: MenuController,
    public navCtrl: NavController,
    public awsService: AwsService,
    public eventService: EventService,
    public auth: AuthService,
    public translateService: TranslateLabelService
  ) { }

  ngOnInit() {
    this.eventService.alertCount$.subscribe((data: any) => {
      this.totalUnread = data.total;
    })
  }

  logoSrc(company: Company): string | null {
    return resolvedStoredImageUrl(company?.company_logo_url, company?.company_logo, this.awsService.cloudinaryUrl);
  }

  showLogo(company: Company): boolean {
    const src = this.logoSrc(company);
    return !!src && company?.logo_failed_src !== src;
  }

  markLogoFailed(company: Company) {
    company.logo_failed_src = this.logoSrc(company);
  }

  /**
   * change theme
   */
  changeTheme() {
    if (!this.auth.theme || this.auth.theme == 'day') {
      this.auth.setTheme('night');
    } else {
      this.auth.setTheme('day');
    }
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

  setCurrency(currency) {
    this.auth.setCurrencyPrf(currency);
    this.navCtrl.navigateRoot(['/']);
    this._menuCtrl.close();
  }

  changeLanguage(event) {
    const lang = this.translateService.currentLang == 'ar' ? 'en' : 'ar';
    this.eventService.setLanguagePref$.next(lang);
  }
}
