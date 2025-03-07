import { Candidate } from './candidate'
import { Company } from './company'
import { Brand } from './brand';
import { Mall } from './mall';

export class Store {
    store_id: number;
    company_id: number;
    store_name: string;
    store_location: string;
    store_status: number;
    store_total_candidates: number;

    // Related
    candidates: Candidate[];
    candidatesSummary: Candidate[];
    company: Company;
    mall: Mall;
    brand: Brand;

    totalCandidates: number;
    //for ui 
    isOpen: boolean;
}
