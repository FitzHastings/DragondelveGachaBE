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

import { Character } from './entities/character.entity';

@Injectable()
export class CharacterService {
    public constructor(@InjectRepository(Character) private readonly characterRepository: Repository<Character>) {
    }

    /**
     * Finds and returns all characters owned by a specific owner.
     *
     * @param {number} ownerId - The ID of the owner whose characters are to be retrieved.
     * @return {Promise<Character[]>} A promise that resolves to the list of characters owned by the specified owner.
     */
    public async findOwned(ownerId: number): Promise<Character[]> {
        return await this.characterRepository.find({
            where: { owner: { id: ownerId } },
            relations: ['template', 'template.rarity', 'template.setting', 'template.fullImage', 'template.smallImage']
        });
    }

    /**
     * Finds a single character record by its ID, including related entities.
     *
     * @param {number} id - The ID of the character to find.
     * @param ownerId
     * @return {Promise<Character>} - A promise that resolves to the found character with specified relations.
     */
    public async findOne(id: number, ownerId: number): Promise<Character> {
        return await this.characterRepository.findOne({
            where: { id, ownerId },
            relations: ['template', 'template.rarity', 'template.setting', 'template.fullImage', 'template.smallImage']
        });
    }
}
