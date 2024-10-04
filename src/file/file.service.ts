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

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
}
