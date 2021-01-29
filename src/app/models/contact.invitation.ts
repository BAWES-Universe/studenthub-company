import {Contact} from './contact';
import {Company} from './company';

export class ContactInvitation {
    contact_invitation_uuid: string;
    contact_uuid: string;
    company_id: number;
    email_to_invite: string;
    accepted: number;
    created_at: string;
    updated_at: string;
    contact: Contact;
    company: Company;
}
