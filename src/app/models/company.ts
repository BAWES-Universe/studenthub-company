import { Store } from './store';

export class Company {
    company_id: number;
    parent_company_id: number;
    company_name: string;
    company_email: string;
    company_hourly_rate: number;
    company_bonus_commission: number;
    company_status: number;
    totalCandidates: number;
    subcompanies: Company[];
    subCompanies: Company[];
    stores: Store[];
}
