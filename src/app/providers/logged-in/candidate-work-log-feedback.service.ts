import { Injectable } from '@angular/core';
//models
import { CandidateWorkLogFeedback } from 'src/app/models/candidate-work-log-feedback';
//services
import { AuthHttpService } from './authhttp.service';


@Injectable({
  providedIn: 'root'
})
export class CandidateWorkLogFeedbackService {

  private _endpoint: string = "/candidate-work-log-feedbacks";

  constructor(public _authhttp: AuthHttpService) { 

  }

  save(model: CandidateWorkLogFeedback) {
    let url = this._endpoint;
    return this._authhttp.post(url, model);
  } 
}
