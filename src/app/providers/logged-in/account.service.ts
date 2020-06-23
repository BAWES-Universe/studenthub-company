import { Injectable } from '@angular/core';
import {AuthHttpService} from "./authhttp.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private _accountEndpoint: string = "/account";

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * change password
   * @param oldPassword
   * @param newPassword
   */
  changePassword(oldPassword:string,newPassword:string): Observable<any>{
    let postUrl = `${this._accountEndpoint}`+ '/change-password';
    let params = {
      "old_password": oldPassword,
      "new_password": newPassword,
    };

    return this._authhttp.post(postUrl, params);
  }
}


