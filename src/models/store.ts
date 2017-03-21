import { Candidate } from '../models/candidate'

export class Store {
    store_id: number;
    company_id: number;
    store_name: string;
    store_status:number;
    candidates:Candidate;

}

export class Subcompanies {
    store_id: number;
    company_id: number;
    store_name: string;
    store_status:number;
    candidates:Candidate;

}



