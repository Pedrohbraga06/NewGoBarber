import fs from 'fs';
import path from 'path';
import { lookup as getType } from 'mime-types';
import aws, { S3 } from 'aws-sdk';
import uploadConfig from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';

class DiskStorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new aws.S3({
      region: 'us-east-1',
    });
  }

  public async saveFile(file: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tmpFolder, file);

  const ContentType = getType(originalPath) as string | false | null;

    if (!ContentType) {
      throw new Error('File not found');
    }

    const fileContent = await fs.promises.readFile(originalPath);

    await this.client
      .putObject({
        Bucket:
          // uploadConfig may not include aws config in this repo snapshot —
          // fall back to environment variable if available
          (uploadConfig as any).config?.aws?.bucket || process.env.AWS_BUCKET,
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        ContentType,
      })
      .promise();

    await fs.promises.unlink(originalPath);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket:
          (uploadConfig as any).config?.aws?.bucket || process.env.AWS_BUCKET,
        Key: file,
      })
      .promise();
  }
}

export default DiskStorageProvider;