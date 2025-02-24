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

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Rarity } from '../rarity/entities/rarity.entity';
import { CharacterTemplate } from '../template/entities/character-template.entity';
import { Character } from '../character/entities/character.entity';
import { User } from '../user/entities/user.entity';

/**
 * RollService is an injectable class responsible for handling the logic related to character rolling
 * based on user identity, energy consumption, rarity, and character template selection.
 */
@Injectable()
export class RollService {
    /**
     * Constructor for initializing with injected repository instances.
     *
     * @param {Repository<Rarity>} rarityRepository - Repository for managing Rarity entities
     * @param {Repository<CharacterTemplate>} templateRepository - Repository for managing CharacterTemplate entities
     * @param {Repository<Character>} characterRepository - Repository for managing Character entities
     * @param {Repository<User>} userRepository - Repository for managing User entities
     * @return {void}
     */
    public constructor(
        @InjectRepository(Rarity) private readonly rarityRepository: Repository<Rarity>,
        @InjectRepository(CharacterTemplate) private readonly templateRepository: Repository<CharacterTemplate>,
        @InjectRepository(Character) private readonly characterRepository: Repository<Character>,
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {
    }

    /**
     * Reduces the user's energy by one and assigns a random character template to the user.
     *
     * @param {User} identity - The user's identity object containing user details.
     * @return {Promise<Character>} A promise that resolves to the newly created character.
     * @throws {BadRequestException} If the user's identity token is invalid.
     */
    public async roll(identity: User): Promise<Character> {
        const user = await this.userRepository.findOne({ where: { id: identity.id } });
        if (!user) throw new BadRequestException('Your Identity Token Is Invalid');
        user.energy = user.energy - 1;
        if (user.energy <= 0) throw new BadRequestException('You Do Not Have Enough Energy To Roll');
        await this.userRepository.save(user);

        const rarity = await this.getRandomRarity();
        const template = await this.getRandomTemplate(rarity);

        const character = this.characterRepository.create({
            templateId: template.id,
            name: template.name,
            ownerId: user.id
        });

        const rolled = await this.characterRepository.save(character);

        return await this.characterRepository.findOne({
            where: { id: rolled.id },
            relations: ['template', 'template.rarity', 'template.setting', 'template.fullImage', 'template.smallImage']
        });
    }

    /**
     * Retrieves a random rarity based on their respective weights from the repository.
     * It throws a NotFoundException if no rarities are found.
     *
     * @return {Promise<Rarity>} A promise that resolves to a randomly selected rarity.
     */
    private async getRandomRarity(): Promise<Rarity> {
        const rarities = await this.rarityRepository.find();
        if (rarities.length === 0) throw new NotFoundException('No Rarities Found!');

        const totalWeight = rarities.reduce((acc, rarity) => acc + rarity.weight, 0);
        let randomWeight = Math.floor(Math.random() * totalWeight);

        let rarity = rarities[0];
        randomWeight -= rarity.weight;

        let index = 1;
        while (randomWeight > 0) {
            rarity = rarities[index];
            randomWeight -= rarity.weight;
            index++;
        }

        return rarity;
    }

    /**
     * Retrieves a random character template based on the given rarity.
     *
     * @param {Rarity} rarity - The rarity level of the template to retrieve.
     * @return {Promise<CharacterTemplate>} A promise that resolves with a random character template matching the specified rarity.
     * @throws {NotFoundException} If no templates are found for the given rarity.
     */
    private async getRandomTemplate(rarity: Rarity): Promise<CharacterTemplate> {
        const templates = await this.templateRepository.find( {
            where: { rarityId: rarity.id, isRollable: true }
        });
        if (templates.length === 0) throw new NotFoundException('No Templates Found!');

        return templates[Math.floor(Math.random() * templates.length)];
    }
}