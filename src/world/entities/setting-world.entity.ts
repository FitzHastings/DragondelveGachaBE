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

import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

import { GeneralEntity } from '../../common/entities/general.entity';
import { ExternalFile } from '../../file/entities/external-file.entity';

/**
 * Represents the setting world entity that extends the GeneralEntity.
 * This entity holds configuration settings for the application, such as
 * name, images, and logo.
 */
@Entity('setting_worlds')
export class SettingWorld extends GeneralEntity {
    /**
     * Represents a name as a string.
     */
    @ApiProperty({ type: String, description: 'name of the setting', example: 'TWINT' })
    @IsString()
    @Column()
    public name: string;

    /**
     * An array of external file objects representing images.
     * Each object in the array contains metadata and content for a specific image file.
     */
    @ApiProperty({ description: 'Setting Images (Read Only)', type: () => ExternalFile, isArray: true })
    @ManyToMany(() => ExternalFile, (externalFile) => externalFile.settings)
    @JoinTable({ name: 'setting_images' })
    public images: ExternalFile[];

    /**
     * Represents an external file that contains the company logo.
     * This file may be used for display purposes throughout the application.
     *
     * @type {ExternalFile}
     */
    @ApiProperty({ description: 'Logo Image (Read Only)', type: () => ExternalFile })
    @ManyToOne(() => ExternalFile, (externalFile) => externalFile.setting)
    @JoinColumn({ name: 'logo_id' })
    public logo: ExternalFile;

    /**
     * A numeric identifier for the logo.
     *
     * This variable represents the unique identifier associated with a specific logo.
     * It is used to reference and retrieve logo assets within the application.
     *
     * @type {number}
     */
    @ApiProperty({ type: Number, description: 'id of the logo', example: 11 })
    @IsInt()
    @IsPositive()
    @IsOptional()
    @Column({ name: 'logo_id', nullable: true })
    public logoId: number;

    // DTO Only Section

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