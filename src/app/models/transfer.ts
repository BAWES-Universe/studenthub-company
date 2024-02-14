import { TransferCandidate } from './transfer-candidate'
import { Invoice } from './invoice'

export class Transfer {
    transfer_id: number;
    company_total: number;
    payment_received_on: string;
    transfer_status: number;
    start_date: string;
    end_date: string;
    transfer_created_at: string;
    transfer_updated_at: string;
    currency_code: string;
    
    // Related
    transferCandidates: TransferCandidate[];
    invoices: Invoice[];
}
