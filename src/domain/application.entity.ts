export enum ApplicationStatus {
    PENDING = 'pending',
    IN_REVIEW = 'in_review',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    CANCELLED = 'cancelled',
}

export class Application {
    private constructor(
        public readonly id: string,
        public readonly applicantId: string,
        public readonly dogId: string,
        public readonly shelterId: string,
        public readonly dogName: string,
        public readonly dogBreed: string,
        public readonly dogImage: string | null,
        public readonly shelterName: string,
        public readonly shelterLogo: string | null,
        public readonly applicantName: string,
        public readonly formData: any,
        public readonly formVersion: number,
        public readonly status: ApplicationStatus,
        public readonly compatibilityScore: number | null,
        public readonly reviews: ApplicationReview[],
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) {}

    public static create(data: {
        id: string,
        applicantId: string,
        dogId: string,
        shelterId: string,
        dogName: string,
        dogBreed: string,
        dogImage: string | null,
        shelterName: string,
        shelterLogo: string | null,
        applicantName: string,
        formData: any,
        formVersion: number,
        status: ApplicationStatus,
        compatibilityScore: number | null,
        reviews: ApplicationReview[],
        createdAt: Date,
        updatedAt: Date,
    }){
        return new Application(
            data.id,
            data.applicantId,
            data.dogId,
            data.shelterId,
            data.dogName,
            data.dogBreed,
            data.dogImage,
            data.shelterName,
            data.shelterLogo,
            data.applicantName,
            data.formData,
            data.formVersion,
            data.status,
            data.compatibilityScore,
            data.reviews,
            data.createdAt,
            data.updatedAt,
        )
    }
}

export class ApplicationReview {
    private constructor(
        public readonly id: string,
        public readonly applicationId: string,
        public readonly fromStatus: ApplicationStatus,
        public readonly toStatus: ApplicationStatus,
        public readonly note: string | null,
        public readonly createdAt: Date,
    ) {}

    public static create(data: {
        id: string,
        applicationId: string,
        fromStatus: ApplicationStatus,
        toStatus: ApplicationStatus,
        note: string | null,
        createdAt: Date,
    }){
        return new ApplicationReview(
            data.id,
            data.applicationId,
            data.fromStatus,
            data.toStatus,
            data.note,
            data.createdAt,
        )
    }
}

export type ApplicationFindAll = Pick<Application, "id" | "dogName" | "dogBreed" | "dogImage" | "shelterName" | "shelterLogo" | "applicantName" | "status" | "createdAt">