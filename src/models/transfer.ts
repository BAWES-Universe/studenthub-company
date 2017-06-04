import { TransferCandidate } from './transfer-candidate'
import { Invoice } from './invoice'

export class Transfer {
    transfer_id: number;
    company_name: string;
    company_email: string;
    company_id: number;
    total: number;
    company_total: number;
    payment_received_on: string;
    transfer_status: number;
    transfer_created_at: string;
    transfer_updated_at: string;
    candidates: TransferCandidate[];
    invoices: Invoice[];
}