export abstract class SheltersMSPort {
  abstract getShelterEmailById(shelterID: string): Promise<string>;
}
