import { Staff } from './staff';
import { Company } from './company';
import { Note } from './note';
import { Contact } from './contact';
import {Invitation} from './invitation';


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
    request_location: string;
    request_additional_info: string;
    request_status: any;
    // request_status: Status;
    request_feedback: string;
    request_created_datetime: string;
    request_updated_datetime: string;
    requestCreatedBy: Staff;
    requestUpdatedBy: Staff;
    contact: Contact;
    company: Company;
    lastActivity: Note;
    invitations: Invitation[];
}
/*
enum Status {
    pending,
    started,
    delivered,
    cancelled
}*/
