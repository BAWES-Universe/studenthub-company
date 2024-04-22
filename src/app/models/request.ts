import { Staff } from './staff';
import { Company } from './company';
import { Note } from './note';
import { Contact } from './contact';
import {Invitation} from './invitation';
import { Country } from './country';

export class Request {
    request_uuid: string;
    company_id: number;
    contact_uuid: string;
    request_created_by: number;
    request_updated_by: number;
    request_position_type: number;
    request_position_title: string;
    request_job_description: string;
    request_compensation: string;
    request_number_of_employees: number;
    no_of_employees_per_story: number;
    request_location: string;
    request_additional_info: string;
    request_status: any;
    // request_status: Status;
    request_feedback: string;
    gender: number;
    nationality_id: number;
    request_created_datetime: string;
    request_updated_datetime: string;
    requestCreatedBy: Staff;
    requestUpdatedBy: Staff;
    contact: Contact;
    company: Company;
    nationality: Country;    
    stories: Story[];
    lastActivity: Note;
    invitations: Invitation[];
    stats: Stats;
    requestSkills: RequestSkill[];
}

export class RequestSkill {
  request_uuid: string;
  skill: string;
}

class Stats {
  accepted: string;
  invited: string;
  rejected: string;
  suggested: string;
}

export class Story {
  story_uuid: string;
  request_uuid: string;
  suggestion_uuid: string;
  staff_id: number;
  story_status: number;
  story_time_spent: number;
  story_created_at: string;
  story_last_updated_at: string;
  request: Request;
  staff: Staff;
  company: Company;
  storyActivities: StoryActivity[];
  latestStoryActivity: StoryActivity;
}

export class StoryActivity {
  story_activity_uuid: string;
  story_uuid: string;
  staff_id: number;
  activity_time_spent: number;
  activity_status	: string;
  activity_created_at: string;
  activity_last_updated_at: string;
  story: Story;
  staff: Staff;
}
