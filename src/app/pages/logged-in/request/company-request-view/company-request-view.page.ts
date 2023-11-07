import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {
  AlertController,
  ToastController,
  LoadingController,
  MenuController,
  ModalController,
  NavController,
  Platform,
  IonContent
} from '@ionic/angular';
// services
import { AuthService } from 'src/app/providers/auth.service';
import { RequestActivityService } from 'src/app/providers/logged-in/request.activity.service';
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { CompanyRequestService } from 'src/app/providers/logged-in/company-request.service';
import { SuggestionService } from 'src/app/providers/logged-in/suggestion.service';
import { EventService } from 'src/app/providers/event.service';
// models
import { Request } from 'src/app/models/request';
import { Note } from 'src/app/models/note';
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-company-request-view',
  templateUrl: './company-request-view.page.html',
  styleUrls: ['./company-request-view.page.scss'],
})
export class CompanyRequestViewPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public request: Request;

  public requestActivities: Note[] = [];

  public suggestedSuggestions = [];

  public acceptedSuggestions = [];

  public rejectedSuggestions = [];
  public segment: string = 'details';
  public request_uuid;
  public loading = false;
  public loadingInvoice = false;
  public loadingActivities = false;
  public pickingUp = false;

  public borderLimit = false;
  public backState = null;

  public activityExpanded: boolean = false;

  public internvalSubscribe;

  public alertConfirmReload;

  constructor(
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public route: ActivatedRoute,
    public authService: AuthService,
    public requestService: CompanyRequestService,
    public requestActivityService: RequestActivityService,
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    public location: Location,
    public suggestionService: SuggestionService,
    public eventService: EventService,
    public translateLabelService: TranslateLabelService,
    public platform: Platform,
    public analyticService: AnalyticsService
  ) {
  }

  ionViewWillLeave() {
    this.analyticService.track('page_exit', {
      'page': 'Request View Page'
    });  
  }
  
  ngOnInit() {
    this.analyticService.page('Request View Page');

    if(!this.request_uuid)
      this.request_uuid = this.route.snapshot.params.request_uuid;

    this.backState = window.history.state;
    const model = window.history.state.model;

    this.loadDetail();

    this.internvalSubscribe = setInterval(_ => {
      this.isRequestUpdated();
    }, 6 * 1000);//every 6 seconds

    this.eventService.userLoggedOut$.subscribe(() => {
      clearInterval(this.internvalSubscribe);
      this.internvalSubscribe = null;
    });

    this.eventService.companyRequestUpdate$.subscribe((data: any) => {
      if(data && data.request_uuid == this.request_uuid) {
        this.request.request_updated_datetime = data.request_updated_datetime;
      }
    });

    this.eventService.noteUpdated$.subscribe((data: any) => {
      if(data && data.request_uuid == this.request_uuid) {
        this.loadRequestActivities();
      }
    });
  }

  /**
   * list invoices
   */
  listInvoice() {
    this.loadRequestActivities();
  }

  /**
   * close this modal
   */
  dismiss() {
    this.location.back();
  }

  /**
   * load request detail
   */
  loadDetail() {
    this.loading = true;

    this.requestService.view(this.request_uuid).subscribe(data => {
      this.request = data;
      this.loadRequestActivities();
      this.loadSuggestions();
    }, () => {
    }, () => {
      this.loading = false;
    });
  }

  /**
   * toggle activity visiblities
   */
  toggleActivityExpanded() {
    this.activityExpanded = !this.activityExpanded;
  }

  /**
   * load request detail
   */
  loadRequestActivities() {
    this.loadingActivities = true;
    this.requestActivityService.list(this.request_uuid).subscribe(data => {
      this.requestActivities = data;
    }, () => {
    }, () => {
      this.loadingActivities = false;
    });
  }

  /**
   * load candidate suggestions for this request
   */
  loadSuggestions() {

    const params = '&request_uuid=' + this.request_uuid;

    this.suggestionService.list(params).subscribe(data => {

      this.suggestedSuggestions = [];

      this.acceptedSuggestions = [];

      this.rejectedSuggestions = [];

      data.forEach(element => {
        if (element.suggestion_status == 1) {
          this.suggestedSuggestions.push(element);
        } else if (element.suggestion_status == 2) {
          this.rejectedSuggestions.push(element);
        } else if (element.suggestion_status == 3) {
          this.acceptedSuggestions.push(element);
        }
      });
    });
  }

  onSuggestionUpdate() {
    this.loadSuggestions();
    this.loadRequestActivities();
    this.content.scrollToPoint(0, 0);
  }

  /**
   * Make date readable by Safari
   * @param date
   */
  toDate(date) {
    if (date) {
      return new Date(date.replace(/-/g, '/'));
    }
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 0);
  }

  cancelledRequest(event, request) {

    if (this.suggestedSuggestions.length > 0) {
      this.toastCtrl.create({
        message: 'Please clear all suggestions by accepting or rejecting before being able to proceed with mark delivered / cancellation',
        buttons: ['Okay']
      }).then(prompt => {
        prompt.present();
      });
      return false;
    }

    this.alertCtrl.create({
      header: 'Please provide feedback',
      inputs: [
        {
          name: 'feedback',
          type: 'textarea',
          placeholder: 'Feedback'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Save',
          handler: (data) => {

            if (!data.feedback) {
              this.alertCtrl.create({
                message: 'Please provide feedback',
                buttons: ['Okay']
              }).then(alert => {
                alert.present();
              });
            }

            request.request_feedback = data.feedback;

            this.requestService.cancel(request).subscribe(async response => {

              if (response.operation == 'success') {
                request.request_status = 'cancelled';
                this.loadRequestActivities();
                this.eventService.reloadStats$.next();

                this.eventService.companyRequestUpdate$.next({
                  request_updated_datetime: response.request_updated_datetime,
                  request_uuid: this.request_uuid
                });

              } else {
                this.toastCtrl.create({
                  message: this.authService.errorMessage(response.message),
                  buttons: ['Okay']
                }).then(prompt => {
                  prompt.present();
                });
              }
            });

          }
        }
      ]
    }).then(alert => { alert.present(); });
  }

  deliveredRequest(event, request) {

    if (this.suggestedSuggestions.length > 0) {
      this.toastCtrl.create({
        message: 'Please clear all suggestions by accepting or rejecting before being able to proceed with mark delivered / cancellation',
        buttons: ['Okay']
      }).then(prompt => {
        prompt.present();
      });
      return false;
    }

    event.preventDefault();
    event.stopPropagation();

    this.alertCtrl.create({
      header: 'Please provide feedback',
      inputs: [
        {
          name: 'feedback',
          type: 'textarea',
          placeholder: 'Feedback'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Save',
          handler: (data) => {

            if (!data.feedback) {
              this.alertCtrl.create({
                message: 'Please provide feedback',
                buttons: ['Okay']
              }).then(alert => {
                alert.present();
              });
            }

            request.request_feedback = data.feedback;

            this.requestService.deliver(request).subscribe(async response => {

              if (response.operation == 'success') {
                request.request_status = 'delivered';
                this.loadRequestActivities();
                this.eventService.reloadStats$.next();

                this.eventService.companyRequestUpdate$.next({
                  request_updated_datetime: response.request_updated_datetime,
                  request_uuid: this.request_uuid
                });

              } else {
                this.toastCtrl.create({
                  message: this.authService.errorMessage(response.message),
                  buttons: ['Okay']
                }).then(prompt => {
                  prompt.present();
                });
              }
            });
          }
        }
      ]
    }).then(alert => { alert.present(); });
  }

  /**
   * check if request updated, confirm reload
   */
  isRequestUpdated() {

    if (!this.request || this.alertConfirmReload) {
      return null;
    }

    this.requestService.isRequestUpdated(this.request_uuid).subscribe(data => {
      if (data.request_updated_datetime != this.request.request_updated_datetime) {
        this.confirmReload(data.request_updated_datetime);
      }
    }, () => {
    }, () => {
      this.loading = false;
    });
  }

  /**
   * confirm data reload when request get updated
   */
  async confirmReload(request_updated_datetime) {

    //this.loadDetail(false);//refresh without showing loader

    this.alertConfirmReload = await this.alertCtrl.create({
      header: 'Request updated',
      subHeader: 'Refresh to view latest update',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            //to ignore current update
            this.request.request_updated_datetime = request_updated_datetime;
            this.alertConfirmReload = null;
          }
        }, {
          text: 'Refresh',
          handler: (data) => {
            this.loadDetail();
            this.alertConfirmReload = null;
          }
        }
      ]
    });
    this.alertConfirmReload.present();
  }
}
