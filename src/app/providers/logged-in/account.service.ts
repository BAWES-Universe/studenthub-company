import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
//services
import { AuthHttpService } from "./authhttp.service";
//models
import { Contact } from 'src/app/models/contact';


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private _accountEndpoint: string = "/account";

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * return account detail
   */
  view(): Observable<any> {
    const url = `${this._accountEndpoint}` + '/view?expand=contactEmails,contactPhones';
    return this._authhttp.get(url);
  }

  /**
   * update account details
   * @param model 
   */
  update(model: Contact): Observable<any> {
    const url = `${this._accountEndpoint}` + '/update';

    const params = {
      name: model.contact_name,
      //position: model.contact_position,
      email: model.contact_email,
      receive_email: model.contact_receive_email,
      receive_notification: model.contact_receive_notification,
      emails: model.contactEmails,
      phones: model.contactPhones
    };

    return this._authhttp.patch(url, params);
  }

  /**
   * Update email address 
   * @param contact Contact 
   */
  updateEmail(contact: Contact): Observable<any> {
    let url = this._accountEndpoint + '/update-email';
    return this._authhttp.post(url, { email: contact.contact_email });
  }

  /**
   * change password
   * @param oldPassword
   * @param newPassword
   */
  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    let postUrl = `${this._accountEndpoint}` + '/change-password';
    
    let params = {
      "old_password": oldPassword,
      "new_password": newPassword,
    };

    return this._authhttp.post(postUrl, params);
  }
}


