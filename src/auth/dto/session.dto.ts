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

import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Represents a session data transfer object.
 *
 * @class
 */

export class SessionDto {
    /**
     * Represents the user identification number.
     *
     * @type {number}
     */
    @IsNumber()
    @ApiProperty({
        description: 'The user identification value, should be prefixed with # when being displayed to the user',
        required: true,
        type: Number,
        example: 2
    })
    public readonly userId: number;

    /**
     * Represents an email address.
     *
     * @type {string} Email
     */
    @ApiProperty({
        description: 'User\'s login',
        required: true,
        type: String,
        example: 'TestUser'
    })
    @IsString()
    public readonly username: string;

    /**
     * Represents the occupation of a person.
     *
     * @type {string} occupation
     */
    @IsString()
    @ApiProperty({
        description: 'Human readable role title for display purposes only, not used in logic',
        required: true,
        type: String,
        example: 'Admin'
    })
    public readonly role: string;
}
