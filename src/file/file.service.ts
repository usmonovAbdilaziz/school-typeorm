import { Injectable, BadRequestException } from '@nestjs/common';
import { existsSync, mkdirSync, writeFile } from 'node:fs';
import { unlink } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { v4 } from 'uuid';

@Injectable()
export class FileService {
  private allowedExtensions = ['jpg', 'jpeg', 'png']; // ruxsat etilgan formatlar
  private allowedExtensionsfile = ['pdf', 'docx']; // ruxsat etilgan formatlar

  async createFile(file: Express.Multer.File): Promise<string> {
    this.validateFile(file);

    try {
      const fileName = `${v4()}_${file.originalname}`;
      const filePath = resolve(__dirname, '..', '..', 'uploads');

      if (!existsSync(filePath)) {
        mkdirSync(filePath, { recursive: true });
      }

      await new Promise<void>((res, rej) => {
        writeFile(join(filePath, fileName), file.buffer, (err) => {
          if (err) rej(err);
          res();
        });
      });

      return fileName;
    } catch (error) {
      throw new BadRequestException('File upload error');
    }
  }

  async createFiles(images: Express.Multer.File[]): Promise<string[]> {
    let files = images
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const urls: string[] = [];
    for (const file of files) {
      const url = await this.createFile(file);
      urls.push(url);
    }
    return urls;
  }

  private validateFile(file: Express.Multer.File) {
    const ext = file.originalname.split('.').pop()?.toLowerCase();
    if (!ext || !this.allowedExtensions.includes(ext)) {
      throw new BadRequestException(
        `Only allowed extensions: ${this.allowedExtensions.join(', ')}`,
      );
    }
  }

  async deleteFiles(fileNames: string[]) {
    if (!fileNames || fileNames.length === 0) return;

    try {
      const filePath = resolve(__dirname, '..', '..', 'uploads');

      await Promise.all(
        fileNames.map(async (fileName) => {
          const fullPath = join(filePath, fileName);
          try {
            await unlink(fullPath);
          } catch {
            // agar fayl bo‘lmasa xato chiqmasin
          }
        }),
      );
    } catch (error) {
      throw new BadRequestException('File delete error');
    }
  }
  private async validateFileToFile(file: Express.Multer.File) {
    const ext = file.originalname.split('.').pop()?.toLowerCase();
    if (!ext || !this.allowedExtensionsfile.includes(ext)) {
      throw new BadRequestException(
        `Only allowed extensions: ${this.allowedExtensionsfile.join(', ')}`,
      );
    }
  }
  async createFileToFile(lotFile: Express.Multer.File): Promise<string> {
   await this.validateFileToFile(lotFile);

    try {
      const fileName = `${v4()}_${lotFile.originalname}`;
      const filePath = resolve(__dirname, '..', '..', 'uploadsFile');

      if (!existsSync(filePath)) {
        mkdirSync(filePath, { recursive: true });
      }

      await new Promise<void>((res, rej) => {
        writeFile(join(filePath, fileName), lotFile.buffer, (err) => {
          if (err) rej(err);
          res();
        });
      });

      return fileName;
    } catch (error) {
      throw new BadRequestException('File upload error');
    }
  }
}
