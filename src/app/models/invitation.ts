import {Candidate} from './candidate';

export class Invitation {
  invitation_uuid: string;
  candidate_id: number;
  request_uuid: string;
  invitation_status: string;
  invitation_created_by_staff: number;
  invitation_updated_by_staff: number;
  invitation_created_by_company: number;
  invitation_updated_by_company: number;
  invitation_created_at: string;
  invitation_updated_at: string;
  candidate: Candidate;
}
