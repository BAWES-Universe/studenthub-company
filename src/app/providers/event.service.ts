import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EventService {

  public loadApplicants$ = new Subject();
  public languagePrefUpdated$ = new Subject();
  public agentCompanyChanged$ = new Subject();
  public noCompanyFound$ = new Subject();
  public setOneSignal$ = new Subject();
  public profileUpdated$ = new Subject();
  public companyCreated$ = new Subject();
  public companyUnAssigned$ = new Subject();
  public companyUpdated$ = new Subject();
  public profileCompleteRequired$ = new Subject();
  public error404$ = new Subject();
  public error500$ = new Subject();
  public errorStorage$ = new Subject();

  public userLogined$ = new Subject();
  public pageSelected$ = new Subject();
  public internetOffline$ = new Subject();
  public internetOnline$ = new Subject();
  public roleChanged$ = new Subject();
  public refreshEmployerList$ = new Subject();
  public userLoggedOut$ = new Subject();
  public updateCounts$ = new Subject();
  public alertCount$ = new Subject();
  public conversationCount$ = new Subject();
  public applicationCount$ = new Subject();
  public jobUpdated$ = new Subject();
  public jobCreated$ = new Subject();
  public invitationSent$ = new Subject();
  public updateStats$ = new Subject();
  public updateCurrency$ = new Subject();
  public applicationRejected$ = new Subject();
  public googleLoginFinished$ = new Subject();
  public savedSearchUpdated$ = new Subject();
  public locationSelected$ = new Subject();
  public recentSearchUpdarted$ = new Subject();
  public accountAssignmentRemoved$ = new Subject();
  public scroll$ = new Subject();
  public companyRequestUpdate$ = new Subject();
  public noteUpdated$ = new Subject();
  public reloadStats$ = new Subject();

  public companyChanged$ = new Subject();

  public totalEmployee$ = new Subject();
  public loadInvitation$ = new Subject();
  public setLanguagePref$ = new Subject();
  public locationUpdated$ = new Subject();

  public transferCreated$ = new Subject();
}
