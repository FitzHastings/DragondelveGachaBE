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

import { extname } from 'path';

import { Controller, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as uuid from 'uuid';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { JwtGuard } from '../auth/guards/jwt.guard';

import { ExternalFile } from './entities/external-file.entity';
import { FileService } from './file.service';

/**
 * Controller class for handling file operations.
 */
@Controller('file')
@ApiTags('File Module')
export class FileController {
    /**
     * Creates a new instance of the class.
     *
     * @param {FileService} fileService - The file service to be used by the class.
     * @since v0.5.0
     */
    public constructor(private readonly fileService: FileService) {
    }

    /**
     * Uploads a file to the server.
     *
     * @param {Array<ExternalFile>} files - The array of files to be uploaded.
     * @returns {Promise<ExternalFile>} - A promise that resolves to the uploaded file.
     * @since v0.5.0
     */
    @ApiUnauthorizedResponse({ description: 'Invalid or expired token' })
    @ApiOkResponse({ type: ExternalFile, description: 'Reified File Handler' })
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @ApiOperation({ summary: 'Upload a file' })
    @UseInterceptors(
        FilesInterceptor('file', 10, {
            storage: diskStorage({
                destination: './public',
                filename: (_req, file, cb) => {
                    const randomName = uuid.v4();
                    return cb(null, `${randomName}${extname(file.originalname)}`);
                }
            })
        })
    )
    @Post('upload')
    public async uploadFile(@UploadedFiles() files: Array<ExternalFile>): Promise<ExternalFile> {
        const file = files[0];
        return await this.fileService.reifyFile(file);
    }
}

