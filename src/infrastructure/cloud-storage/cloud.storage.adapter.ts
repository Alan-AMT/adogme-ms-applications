import { ImagesPort } from "../../domain/storage.port.js";
import { Injectable } from "@nestjs/common";
import { GetSignedUrlConfig, Storage } from '@google-cloud/storage';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CloudStorageAdapter implements ImagesPort {
    storage: Storage;
    constructor(private readonly configService: ConfigService) {
        this.storage = new Storage();
    }
    async generateUploadLinks(applicationId: string, imageIds: string[]): Promise<string[]> {
        if (!imageIds || imageIds.length == 0) {
            return [];
        }
        try {
            // The ID of your GCS bucket
            // const BUCKET_NAME_UPLOADS = this.configService.get<string>('BUCKET_NAME_UPLOADS');
            const BUCKET_NAME_UPLOADS = 'adogme-applications'
            
            if (!BUCKET_NAME_UPLOADS) {
                throw new Error("BUCKET_NAME_UPLOADS is not defined in the environment config")
            }

            // Creates a client
            const storage = new Storage();
            
            const OPTIONS: GetSignedUrlConfig = {
                version: "v4",
                action: "write",
                expires: Date.now() + 30 * 60 * 1000, // 30 minutes
                contentType: "application/octet-stream",
            };
            
            // The full path of your file inside the GCS bucket
            const promises = imageIds.map((imageId) => storage.bucket(BUCKET_NAME_UPLOADS).file(`${applicationId}/${imageId}.jpg`).getSignedUrl(OPTIONS))
            const results: string[][] = await Promise.all(promises)

            const urls: string[] = results.map(r => r[0])

            return urls;
        } catch (error) {
            console.error(error)
            throw new Error("Failed to generate links for application images" + error.message)
        }
    }
}
