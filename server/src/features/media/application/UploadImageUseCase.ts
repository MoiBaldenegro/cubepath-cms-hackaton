import { MediaRepository } from '../domain/MediaRepository';

export class UploadImageUseCase {
  constructor(private readonly mediaRepository: MediaRepository) {}

  async execute(file: Express.Multer.File, filename?: string): Promise<string> {
    return this.mediaRepository.uploadImage(file, filename);
  }
}
