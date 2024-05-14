import { Candidate } from './candidate';
import { CandidateWorkHistory } from './candidate-work-history';

export class TransferCandidate {
    tc_id: number;
	transfer_id: number;
	candidate_id: number;
    store_id: number;
    store_name: string;
    company_id: number;
    company_name: string;
    company_email: string;
    company_hourly_rate: number;
    hours: number;
    bonus: number;
    paid: number;
    currency_code: string;
    
    company_total: number;

    total_paid: number;//company_total - dynamically calculated

    // Related
    candidate: Candidate;
    currentWorkHistory: CandidateWorkHistory;
}
