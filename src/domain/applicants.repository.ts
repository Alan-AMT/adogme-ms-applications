import { Applicant } from './applicant.entity.js';

export abstract class ApplicantsRepository {
    abstract create(applicant: Applicant): Promise<void>;
}
