import { Candidate } from "./candidate";
import { Company } from "./company";
import { Contract } from "./contract";
import { Staff } from "./staff";
import { Store } from "./store";

export class CandidateWorkHistory {
    id: number;
    candidate_id: number;
    contract_uuid: string;
    store_id: number; 
    company_id: number; 
    parent_company_id: number; 
    staff_id: number; 
    start_date: string;
    end_date: string;
    candidate_hourly_rate: number; 
    company_hourly_rate: number;
    transfer_cost: number;//store level transfer cost
    transferCost: number;//effective transfer cost 

    company: Company;
    store: Store;
    candidate: Candidate;
    contract: Contract;
    staff: Staff;
}