import { Injectable } from '@nestjs/common';
import { GoogleAuth } from 'google-auth-library';
import { SheltersMSPort } from '../../domain/shelters-ms.port.js';
import { decode, JwtPayload } from 'jsonwebtoken';

interface Shelter {
  email: string;
  rest: any;
}

@Injectable()
export class SheltersMSAdapter implements SheltersMSPort {
  sheltersServiceToken: string;
  async getShelterEmailById(shelterId: string): Promise<string> {
    try {
      if (this.checkTokenExpired()) {
        await this.refreshTokenClient();
      }
      const response = await fetch(
        `https://adogme-ms-shelters-1087097859781.us-central1.run.app/shelters-ms/shelter/${shelterId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.sheltersServiceToken}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error(`Shelters service error! status: ${response.status}`);
      }
      const data: Shelter = await response.json();
      const { email, ...rest } = data;
      return email;
    } catch (e) {
      console.error(e);
      throw new Error('Failed to update dogs shelter data in Dogs service');
    }
  }

  checkTokenExpired(): boolean {
    if (!this.sheltersServiceToken) return true;
    const decodedToken = decode(this.sheltersServiceToken) as JwtPayload;
    const currentTime = Date.now() / 1000;
    return decodedToken.exp! <= currentTime - 200;
  }

  async refreshTokenClient(): Promise<void> {
    try {
      const auth = new GoogleAuth();
      let audience = process.env.SHELTERS_SERVICE_AUDIENCE || '';
      //   if (!audience && process.env.DOGS_SERVICE_URL) {
      if (!audience) {
        try {
          //   const url = new URL(process.env.DOGS_SERVICE_URL);
          const url = new URL(
            'https://adogme-ms-shelters-1087097859781.us-central1.run.app',
          );
          audience = url.origin;
        } catch (e) {
          //   audience = process.env.DOGS_SERVICE_URL;
          audience =
            'https://adogme-ms-shelters-1087097859781.us-central1.run.app';
        }
      }
      const client = await auth.getIdTokenClient(audience);
      const token = await client.idTokenProvider.fetchIdToken(audience);
      this.sheltersServiceToken = token;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to refresh Shelters service token');
    }
  }
}
