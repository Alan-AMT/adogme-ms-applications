export abstract class ImagesPort {
    abstract generateUploadLinks(applicationId: string, imageIds: string[]): Promise<string[]>;
}
