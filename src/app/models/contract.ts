import { Candidate } from "./candidate";
import { Company } from "./company";
import { FixedPriceContract } from "./fixed-price-contract";
import { HourlyContract } from "./hourly-contract";
import { MonthlySalaryContract } from "./monthly-salary-contract";
import { Store } from "./store";

export class Contract {
    contract_uuid: string;
    company_id: number;
    parent_company_id: number;
    candidate_id: number;
    store_id: number;
    sar_id: number;

    type: string;
    detail: string;
    start_date: string;
    end_date: string;
    transfer_cost: number;
    currency_code: string;
    status: number;
    created_by: number;
    created_at: string;
    updated_at: string;
    fixedPriceContract: FixedPriceContract;
    hourlyContract: HourlyContract;
    monthlySalaryContract: MonthlySalaryContract;
    amount: any;//FixedPriceContract | HourlyContract | MonthlySalaryContract
    
    candidate: Candidate;
    store: Store;
    company: Company;
    parentCompany: Company;
}