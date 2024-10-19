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

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

export class UpdateCharacterTemplateDto {
    /**
     * Represents the name of a person or entity.
     *
     * @type {string}
     */
    @ApiPropertyOptional({ description: 'Name of this Character Template', type: String, example: 'common' })
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    public name?: string;

    /**
     * A variable that holds a textual description.
     * Can be used for storing any descriptive text.
     * Example: "This is a description of a product."
     *
     * @type {string}
     */
    @ApiPropertyOptional({ description: 'Description of character', type: String, example: 'Character is very cool and strong and smart' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    public description?: string;

    /**
     * A string containing a quotation.
     * This variable is intended to store a quote, which can be used for displaying a notable saying
     * or phrase in applications such as quote of the day features, motivational messages, etc.
     *
     * @type {string}
     */
    @ApiPropertyOptional({ description: 'Quote of character', type: String, example: 'Hello!' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    public quote?: string;

    /**
     * A boolean indicating whether an object can be rolled for in roll API.
     */
    @ApiPropertyOptional({ description: 'Indicates whether a template can be rolled for in roll API', type: Boolean, example: true })
    @IsBoolean()
    @IsOptional()
    public isRollable?: boolean;

    /**
     * Represents the identifier for the rarity level of an item.
     *
     * This unique identifier is used to differentiate between various levels of rarity
     * for items within the system. Each rarity level is assigned a distinct numerical value
     * that signifies its scarcity and value.
     *
     * @type {number}
     */
    @ApiPropertyOptional({ description: 'Rarity id of this template', type: Number, example: 1 })
    @IsInt()
    @IsPositive()
    @IsOptional()
    public rarityId: number;
}