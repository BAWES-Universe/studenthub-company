
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

export class TransferCandidate {
    candidate_id: number;
    hours: number;
    bonus: number
}

export class Invoice {
    invoice_id: number;
    transfer_id: number;
    invoice_Date: string;
    invoice_status: string;
}