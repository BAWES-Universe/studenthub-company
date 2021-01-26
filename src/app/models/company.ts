import { Store } from './store';
import {CompanyContact} from "./company-contact";

export class Company {
    company_id: number;
    parent_company_id: number;
    company_name: string;
    company_common_name_en: string;
    company_common_name_ar: string;
    company_description_en: string;
    company_description_ar: string;
    company_website: string
    company_email: string;
    company_logo: string;
    company_hourly_rate: number;
    company_bonus_commission: number;
    company_followup: any;
    total_candidate: number;
    no_of_active_requests: number;
    is_request_updated_in_30_days: boolean;
    company_followup_interval_weeks: number;
    company_last_followup_datetime: string;
    company_created_at: string;
    company_updated_at: string;
    deleted: number;
    totalCandidates: number;
    subcompanies: Company[];
    subCompanies: Company[];
    stores: Store[];
    companyContacts: CompanyContact[];
}
