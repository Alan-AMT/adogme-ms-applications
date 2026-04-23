import { Applicant } from './applicant.entity.js';

export abstract class ApplicantsRepository {
    abstract create(applicant: Applicant): Promise<void>;
    abstract findById(id: string): Promise<Applicant | null>;
    abstract findByUserId(userId: string): Promise<Applicant | null>;
    abstract update(applicant: Applicant): Promise<void>;
}
