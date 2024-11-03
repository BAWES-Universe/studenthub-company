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

  /**
   * @param arr_cwd_uuid 
   * @param model 
   * @returns 
   */
  bulkSave(arr_cwd_uuid: string[], model: CandidateWorkLogFeedback) {
    let url = this._endpoint + "/bulk-save";
    
    /*$arr_cwd_uuid = Yii::$app->request->getBodyParam("arr_cwd_uuid");
        $status = Yii::$app->request->getBodyParam("status");
        $note = Yii::$app->request->getBodyParam("note");
        $reason = Yii::$app->request->getBodyParam("reason");
        $rating = Yii::$app->request->getBodyParam("rating");
        $is_public = (int) Yii::$app->request->getBodyParam("is_public");
*/

    return this._authhttp.post(url, {
      ...model,
      arr_cwd_uuid
    });
  }

  save(model: CandidateWorkLogFeedback) {
    let url = this._endpoint;
    return this._authhttp.post(url, model);
  } 
}
