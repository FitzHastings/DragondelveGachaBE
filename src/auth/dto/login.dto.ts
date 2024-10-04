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

import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Represents a login data transfer object (DTO).
 *
 * @class
 */
export class LoginDto {
    /**
     * Represents the email address of a user.
     *
     * @type {string} email
     */
    @ApiProperty({
        description: 'Username',
        example: 'TestUsert'
    })
    @IsString()
    public readonly username: string;

    /**
     * The password variable represents the user's password.
     *
     * @type {string}
     */
    @ApiProperty({
        description: 'user\'s password',
        example: 'Password123'
    })
    @IsString()
    public readonly password: string;
}
