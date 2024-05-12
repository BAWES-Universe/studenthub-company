import { Candidate } from "./candidate";
import { Fulltimer } from "./fulltimer";
import { Request } from "./request";

export class RequestApplication {
    application_uuid: string;
    candidate_id: number; 
    fulltimer_uuid: string; 
    request_uuid: string; 
    status: number; 
    created_at: string; 
    updated_at: string;
    candidate: Candidate;
    fulltimer: Fulltimer;
    requestInterview: any;
    request: Request;
}