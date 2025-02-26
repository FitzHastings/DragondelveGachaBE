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

import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { IsAdminGuard } from '../auth/guards/is-admin';
import { Identity } from '../auth/decorators/identity.decorator';

import { CharacterService } from './character.service';
import { Character } from './entities/character.entity';

@ApiTags('Character Module')
@Controller('character')
export class CharacterController {
    public constructor(private readonly characterService: CharacterService) {
    }

    @ApiOperation({ summary: 'Get Owned Characters' })
    @ApiOkResponse({ type: Character, description: 'Owned Characters', isArray: true })
    @ApiBearerAuth()
    @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
    @UseGuards(JwtGuard)
    @Get('/')
    public async findOwned(@Identity() identity): Promise<Character[]> {
        return await this.characterService.findOwned(identity.id);
    }

    /**
     * Retrieves the details of a Character Template by its ID.
     *
     * @param {number} id - The ID of the Character Template to retrieve.
     * @return {Promise<CharacterTemplate>} A promise that resolves to the details of the Character Template.
     */
    @ApiOperation({ summary: 'Get Character Details by Id' })
    @ApiParam({ name: 'id', description: 'Id of the Rarity' })
    @ApiOkResponse({ type: Character, description: 'Character with all details' })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Get('/:id')
    public async findOne(@Param('id') id: number, @Identity() identity): Promise<Character> {
        return await this.characterService.findOne(id, identity.id);
    }
}
