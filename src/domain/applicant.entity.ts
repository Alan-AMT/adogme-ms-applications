export class Applicant {
    private constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly userName: string,
        public readonly address: string,
        public readonly postalCode: string,
        public readonly phone: string | null,
        public readonly email: string | null,
        public readonly avatarUrl: string | null,
        public readonly vector: number[],
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) {}

    public static create(applicantData: {
        id: string,
        userId: string,
        userName: string,
        address: string,
        postalCode: string,
        phone: string | null,
        email: string | null,
        avatarUrl: string | null,
        vector: number[],
        createdAt: Date,
        updatedAt: Date,
        
    }): Applicant {
        return new Applicant(
            applicantData.id,
            applicantData.userId,
            applicantData.userName,
            applicantData.address,
            applicantData.postalCode,
            applicantData.phone,
            applicantData.email,
            applicantData.avatarUrl,
            applicantData.vector,
            applicantData.createdAt,
            applicantData.updatedAt,
        )
    }
}