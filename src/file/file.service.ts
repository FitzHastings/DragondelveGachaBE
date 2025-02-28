/* Copyright 2024 Prokhor Kalinin

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

import * as path from 'node:path';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as sharp from 'sharp';

import { ExternalFile } from './entities/external-file.entity';


/**
 * Service class for handling file operations.
 *
 * @module FileService
 */
@Injectable()
export class FileService {
    /**
     * Constructs a new instance of the class.
     *
     * @param {Repository<ExternalFile>} fileRepository - The repository for external files.
     */
    public constructor(@InjectRepository(ExternalFile) private readonly fileRepository: Repository<ExternalFile>) {
    }

    /**
     * Reify the given file by saving it to the file repository.
     *
     * @param {ExternalFile} file - The file to be reified.
     * @returns {Promise<ExternalFile>} - A promise that resolves with the reified file.
     */
    public async reifyFile(file: ExternalFile): Promise<ExternalFile> {
        return await this.fileRepository.save(file);
    }

    /**
     * Processes an uploaded file: saves original, converts to JPG, resizes, and stores metadata.
     * @param file The uploaded file object from Multer.
     * @param originalPath Path to the uploaded file on disk.
     */
    public async processAndReifyFile(file: Express.Multer.File, originalPath: string): Promise<ExternalFile> {
        console.log(file);
        const baseName = path.basename(originalPath, path.extname(originalPath)); // Filename without extension
        const uploadDir = path.dirname(originalPath);

        const jpgPath = path.join(uploadDir, `${baseName}.jpg`);
        const resizedPath = path.join(uploadDir, `${baseName}_600w.jpg`);

        const savedFile = await this.reifyFile(file as unknown as ExternalFile);
        await sharp(originalPath)
            .jpeg({ quality: 90 })
            .toFile(jpgPath);
        const metadata = await sharp(jpgPath).metadata();
        if (!metadata.width || !metadata.height) throw new Error('Invalid image dimensions');

        const width = 600;
        const height = Math.round((metadata.height / metadata.width) * width);

        await sharp(jpgPath)
            .resize(width, height)
            .toFile(resizedPath);

        savedFile.thumbnailPath = `${baseName}_600w.jpg`;
        savedFile.optimizedPath = resizedPath;
        return await this.fileRepository.save(savedFile);
    }
}
