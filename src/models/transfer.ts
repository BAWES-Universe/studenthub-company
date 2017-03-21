export class Transfer {
    candidate_id: number;
    hours: number;
    bonus: number
}


export class TransferDetails {
    tc_id: string;
    transfer_id: string;
    candidate_id: string;
    hours: string;
    bonus: string;
    tc_created_at: string;
    tc_updated_at: string;
    store_name: string;
    company_name: string;
    company_email: string;
    candidate_hourly_rate: string;
    candidate_name: string;
    candidate_email: string;
}

export class TransferListModel {
    transfer_id: string;
    company_id: string;
    transfer_status: string;
    transfer_created_at: string;
    transfer_updated_at: string;
    company_name: string;
    company_email: string;
    edit_transfer_status: string;
}





