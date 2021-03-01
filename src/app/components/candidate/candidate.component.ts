import { Component, OnInit, Input } from '@angular/core';
// models
import { Candidate } from 'src/app/models/candidate';
// services
import { AwsService } from 'src/app/providers/aws.service';
import {Invitation} from 'src/app/models/invitation';


@Component({
  selector: 'candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.scss'],
})
export class CandidateComponent implements OnInit {

  @Input() candidate: Candidate;
  @Input() invitation: Invitation;

  constructor(
    public aws: AwsService
  ) {
  }

  ngOnInit() {
  }

  /**
   * on image error
   */
  onImageError() {
    this.candidate.candidate_personal_photo = null;
  }
}
