import { Injectable } from '@angular/core';

// service
import {AuthHttpService} from './authhttp.service';

@Injectable({
  providedIn: 'root'
})
export class RequestCandidateInvitationService {

  private _invitationEndpoint = '/request-candidate-invitation';

  constructor(
    private _authHttp: AuthHttpService
  ) { }

  /**
   * create new invitation_uuid for request
   * @param params
   */
  create(params) {
    return this._authHttp.post(this._invitationEndpoint, {
      request_uuid: params.request_uuid,
      candidate_id: params.candidate_id
    });
  }
}
