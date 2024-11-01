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

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Rarity } from '../rarity/entities/rarity.entity';
import { CharacterTemplate } from '../template/entities/character-template.entity';
import { Character } from '../character/entities/character.entity';

@Injectable()
export class RollService {
    public constructor(
        @InjectRepository(Rarity) private readonly rarityRepository: Repository<Rarity>,
        @InjectRepository(CharacterTemplate) private readonly templateRepository: Repository<CharacterTemplate>,
        @InjectRepository(Character) private readonly characterRepository: Repository<Character>
    ) {
    }
}