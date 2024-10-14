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

import { IsArray, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data Transfer Object for updating settings.
 */
export class UpdateSettingDto {
    /**
     * Represents a name as a string.
     */
    @ApiPropertyOptional({ type: String, description: 'name of the setting', example: 'TWINT' })
    @IsString()
    @IsOptional()
    public name: string;

    /**
     * A numeric identifier for the logo.
     *
     * This variable represents the unique identifier associated with a specific logo.
     * It is used to reference and retrieve logo assets within the application.
     *
     * @type {number}
     */
    @ApiPropertyOptional({ type: Number, description: 'id of the logo', example: 11 })
    @IsInt()
    @IsPositive()
    @IsOptional()
    public logoId: number;

    /**
     * Array of image identifier numbers.
     *
     * This array holds numeric IDs corresponding to specific images. Each number in the array
     * should be a unique identifier that can be used to retrieve or reference an image within
     * an application or database.
     *
     * @type {number[]}
     */
    @ApiPropertyOptional({ description: 'Ids of the images', type: Number, isArray: true })
    @IsArray()
    @IsOptional()
    public imageIds: number[];
}