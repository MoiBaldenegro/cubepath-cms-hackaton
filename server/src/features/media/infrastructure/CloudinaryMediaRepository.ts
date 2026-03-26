/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { MediaRepository } from '../domain/MediaRepository';

@Injectable()
export class CloudinaryMediaRepository implements MediaRepository {
  constructor(private config: ConfigService) {
    const cloudName = this.config.get('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.config.get('CLOUDINARY_API_KEY');
    const apiSecret = this.config.get('CLOUDINARY_API_SECRET');

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('Cloudinary credentials missing:', {
        cloudName: !!cloudName,
        apiKey: !!apiKey,
        apiSecret: !!apiSecret,
      });
    }
    cloudinary.config({
      cloud_name: cloudName || '',
      api_key: apiKey || '',
      api_secret: apiSecret || '',
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    filename?: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const options: any = { folder: 'testimonials' };
      if (filename) options.public_id = filename;
      cloudinary.uploader
        .upload_stream(options, (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        })
        .end(file.buffer);
    });
  }
}
