import { Component } from "@angular/core";
import { PopoverController } from "@ionic/angular";


@Component({
    template: `
      <ion-list>
        <ion-item (click)="close('un-assign')" tappable lines="none">
          {{ "Request to un-assign" | translate }}
        </ion-item>
        <ion-item (click)="close('change-store')" tappable lines="none">
          {{ "Change Store" | translate }}
        </ion-item>
      </ion-list>
    `
})
export class CandidateOptionComponent {

    constructor(public popCtrl: PopoverController) { }

    close(data) {
        this.popCtrl.getTop().then(overlay => {
            if (overlay) {
              this.popCtrl.dismiss({ action: data });
            }
        });
    }
}