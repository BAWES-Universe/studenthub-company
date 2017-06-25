import { Candidate } from './candidate';

export class TransferCandidate {
    tc_id: number;
	transfer_id: number;
	candidate_id: number;
    store_id: number;
    store_name: string;
    company_id: number;
    company_name: string;
    company_email: string;
    company_hourly_rate: string;
    hours: string;
    bonus: string;
    paid: number;
    total_paid: number;
    transfer_cost: number;

    // Related
    candidate: Candidate;
}
