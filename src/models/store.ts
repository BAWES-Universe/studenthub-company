import { Candidate } from './candidate'
import { Company } from './company'

export class Store {
    store_id: number;
    company_id: number;
    store_name: string;
    store_status: number;
    store_created_at: string;
    store_updated_at: string;

    // Related
    candidates: Candidate[];
    company: Company;
}
