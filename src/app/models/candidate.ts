import { Store } from './store';
import { Company } from './company';
import { University } from './university';
import { Country } from './country';
import { Area } from './area';

export class Candidate {
    candidate_id: number;
    store_id: number;
    university_id: number;    
    candidate_area_uuid: string;
    country_id: number;
    candidate_name: string;
    candidate_name_ar: string;
    candidate_personal_photo: string;
    candidate_email: string;
    candidate_email_verification: any;
    candidate_phone: string;
    candidate_address_line1: string;
    candidate_birth_date: string;
    candidate_civil_id: number;
    candidate_civil_expiry_date: string;
    candidate_civil_photo_front: string;
    candidate_civil_photo_back: string;
    age: number;

    // Related
    store: Store;
    company: Company;
    university: University;
    country: Country;
    area: Area;
    nationality: Country;

    isProfileCompleted: any;
}
