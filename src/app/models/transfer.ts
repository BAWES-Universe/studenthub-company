import { TransferCandidate } from './transfer-candidate'
import { Invoice } from './invoice'

export class Transfer {
    transfer_id: number;
    company_total: number;
    payment_received_on: string;
    transfer_status: number;
    transfer_status_name: string;
    start_date: string;
    end_date: string;
    transfer_created_at: string;
    transfer_created_at_unix: string;
    transfer_updated_at: string;
    transfer_updated_at_unix: string;
    currency_code: string;
    
    // Related
    transferCandidates: TransferCandidate[];
    invoices: Invoice[];
}
