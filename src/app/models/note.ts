import { Company } from './company';
import { Request } from './request';
import { CompanyContact } from './company-contact';
import { Candidate } from './candidate';
import { Contact } from './contact';
import { RequestChecklist } from './request-checklist';

enum NoteType {
    TYPE_INTERNAL_NOTE = "Internal Note",
    TYPE_PHONE_CALL = "Phone Call",
    TYPE_EMAIL = "Email",
    TYPE_MEETING = "Meeting",
    TYPE_INTERVIEW = "Interview",
    TYPE_TASK = "Task",
    TYPE_SUGGESTED = "Suggested",
    TYPE_ACCEPTED = "Accepted",
    TYPE_REJECTED = "Rejected",
    TYPE_INVITATION_ACCEPTED = "Invitation Accepted",
    TYPE_INVITATION_REJECTED = "Invitation Rejected"
}

export class Note {
    note_uuid: string;
    company_id: number;
    candidate_id: number;
    contact_uuid: string;
    fulltimer_uuid: string;
    request_uuid: string;
    request_checklist_uuid: string;
    staff_id: number;
    note_type: NoteType;
    note_text: string;
    created_by: string;
    updated_by: string;
    note_created_datetime: string;
    note_updated_datetime: string;

    contact: Contact;
    candidate: Candidate;
    company: Company;
    request: Request;
    requestChecklist: RequestChecklist;

    createdBy: any;
    updatedBy: any;
}
