import { Component } from "@angular/core";
import { PopoverController } from "@ionic/angular";


@Component({
    template: `
      <ion-list *ngIf="!candidate.storeAssignmentRequest">
        <ion-item (click)="close('un-assign')" tappable lines="none">
          {{ "Request to remove" | translate }}
        </ion-item>
        <ion-item (click)="close('change-store')" tappable lines="none">
          {{ "Change Store" | translate }}
        </ion-item>
      </ion-list>

      <ion-list *ngIf="candidate.storeAssignmentRequest">
        <ion-item (click)="close('cancel-request')" tappable lines="none">
          {{ "Cancel Request" | translate }}
        </ion-item>
      </ion-list>  
    `
})
export class CandidateOptionComponent {

    public candidate; 

    constructor(public popCtrl: PopoverController) { }

    close(data) {
        this.popCtrl.getTop().then(overlay => {
            if (overlay) {
              this.popCtrl.dismiss({ action: data });
            }
        });
    }
}