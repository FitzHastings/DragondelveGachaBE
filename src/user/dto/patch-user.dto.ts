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

import { IsEnum, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { Gender } from '../entities/gender.enum';

/**
 * Represents a DTO (Data Transfer Object) for updating user information.
 * @class
 * @since v0.1.0
 */
export class PatchUserDto {
    /**
     * Represents an email address, used for identification during the user's authentication, must be unique, must be not empty.
     *
     * @type {string} Email
     * @since v0.1.0
     */
    @ApiPropertyOptional({ description: 'Username', type: String, example: 'TestUser' })
    @IsString()
    @IsOptional()
    public username?: string;

    /**
     * The password variable holds a string that represents a user's password.
     *
     * @type {string}
     * @description Stores the password value entered by the user.
     * @name password
     * @since v0.1.0
     */
    @ApiPropertyOptional({ description: 'User password', type: String, example: 'Password123' })
    @IsString()
    @IsOptional()
    public password?: string;

    /**
     * Represents the gender of an individual.
     * @type {string} Gender
     * @description Possible values: "male", "female", "other".
     * @since v0.1.0
     */
    @ApiPropertyOptional({ description: 'User gender', enum: Gender, enumName: 'Gender', example: 'UNKNOWN' })
    @IsEnum(Gender)
    @IsOptional()
    public gender?: string;

    @ApiPropertyOptional({ description: 'User Image Id', type: Number, example: 44 })
    @IsInt()
    @IsPositive()
    @IsOptional()
    public imageId?: number;
}

