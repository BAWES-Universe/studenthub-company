export class CompanyRequest {
    company_request_uuid: string;
    contact_uuid: string;
    contact_name: string;
    company_name: string;
    company_email: string;
    contact_position: string;
    contact_receive_email: boolean;
    contact_password_hash: string;
    phone_number: number;
    requesting_for: string;
    status: number;
    created_at: string;
    updated_at: string;
    country_id: number;
    currency_code: string;
}