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
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

/**
 * Data Transfer Object (DTO) representing the information of a patch rarity.
 */
export class PatchRarityDto {
    /**
     * Represents rarity name such as common, rare, epic.
     */
    @ApiPropertyOptional({ description: 'Name of this Rarity', type: String, example: 'common' })
    @IsString()
    @IsOptional()
    public name: string;

    /**
     * Represents probability weight used in the Roll API to determine the user's roll result.
     */
    @IsInt()
    @IsPositive()
    @IsOptional()
    @ApiPropertyOptional({ description: 'Probabilistic Weight of this rarity ot appear in Roll API', type: Number, example: 2 })
    public weight: number;
}