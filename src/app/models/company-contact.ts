import {Contact} from "./contact";
import {Company} from "./company";

export class CompanyContact {
    contact_uuid: string;
    company_id: number;
    role: number;
    created_at: string;
    updated_at: string;
    created_by: string;
    updated_by: string;
    contact: Contact;
    company: Company;
    contactEmails: [];
    contactPhones: [];
}
