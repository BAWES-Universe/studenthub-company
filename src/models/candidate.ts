import { Store } from './store';
import { University } from './university';
import { Country } from './country';

export class Candidate {
    candidate_id: number;
    candidate_uid: string;
    store_id: number;
    bank_id: number;
    university_id: number;
    country_id: number;
    bank_account_name: string;
    candidate_iban: string;
    candidate_name: string;
    candidate_name_ar: string;
    candidate_personal_photo: string;
    candidate_email: string;
    candidate_phone: string;
    candidate_address_line1: string;
    candidate_birth_date: string;
    candidate_civil_id: number;
    candidate_civil_expiry_date: string;
    candidate_civil_photo_front: string;
    candidate_civil_photo_back: string;
    candidate_hourly_rate: number;
    candidate_auth_key: string;
    candidate_password_hash: string;
    candidate_password_reset_token: string;
    candidate_status: number;
    approved: number;
    store: Store;
    university: University;
    country: Country;
}
