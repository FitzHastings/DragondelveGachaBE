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

import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { Character } from '../character/entities/character.entity';
import { Identity } from '../auth/decorators/identity.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { User } from '../user/entities/user.entity';

import { RollService } from './roll.service';

/**
 * Controller responsible for handling character rolling actions.
 */
@ApiTags('Roll Module')
@Controller('roll')
export class RollController {
    /**
     * Constructs a new instance of the class.
     *
     * @param {RollService} rollService - The service to handle roll operations.
     */
    public constructor(private readonly rollService: RollService) {
    }

    /**
     * Rolls a new character for the given user identity.
     *
     * @param {User} identity - The identity of the user requesting to roll a new character.
     * @return {Promise<Character>} - A promise that resolves to the newly rolled character.
     */
    @ApiOperation({ summary: 'Roll a new character' })
    @ApiOkResponse({ type: Character, description: 'New Character Rolled' })
    @ApiBearerAuth()
    @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
    @UseGuards(JwtGuard)
    @Post('/')
    public async roll(@Identity() identity: User): Promise<Character> {
        return await this.rollService.roll(identity);
    }
}
