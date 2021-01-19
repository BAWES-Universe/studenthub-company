import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {AuthHttpService} from './authhttp.service';
import {AuthService} from "../auth.service";
// service



@Injectable({
  providedIn: 'root'
})
export class InvitationService {

  private _invitationEndpoint = '/invitations';

  constructor(
    private _authHttp: AuthHttpService,
    public authService: AuthService
  ) { }

  /**
   * Invite by email
   * @returns {Observable<any>}
   */
  invite(params): Observable<any> {
    const url = this._invitationEndpoint;
    return this._authHttp.post(url, params);
  }

  /**
   * Reject invitation
   * @param agent_invitation_uuid
   */
  reject(agent_invitation_uuid: string): Observable<any> {
    const url = this._invitationEndpoint + '/reject/' + agent_invitation_uuid;
    return this._authHttp.patch(url, {});
  }

  /**
   * Remove invitation
   * @param contactInvitationUuid
   */
  remove(contactInvitationUuid: string): Observable<any> {
    const url = `${this._invitationEndpoint}/${contactInvitationUuid}`;
    return this._authHttp.delete(url);
  }

  /**
   * Accept invitation
   * @param agent_invitation_uuid
   */
  accept(agent_invitation_uuid: string): Observable<any> {
    const url = this._invitationEndpoint + '/accept/' + agent_invitation_uuid;
    return this._authHttp.patch(url, {});
  }

  /**
   * List pending invitations
   */
  pending(): Observable<any> {
    const url = this._invitationEndpoint + '/pending?expand=agent,employer';
    return this._authHttp.get(url);
  }
  /**
   * List pending invitations
   */
  pendingSentList(): Observable<any> {
    const url = this._invitationEndpoint + '/pending-sent-list/' + this.authService.company_id;
    return this._authHttp.get(url);
  }
}
