import { Company } from './company';
import { Request } from './request';
import { CompanyContact } from './company-contact';
import { Candidate } from './candidate';
import { Contact } from './contact';

export class Note {
    note_uuid: string;
    company_id: number;
    candidate_id: number;
    contact_uuid: string;
    fulltimer_uuid: string;
    request_uuid: string;
    staff_id: number;
    note_type: any;
    note_text: string;
    created_by: string;
    updated_by: string;
    note_created_datetime: string;
    note_updated_datetime: string;

    contact: Contact;
    candidate: Candidate;
    company: Company;
    request: Request;
    updatedBy: any;
}
