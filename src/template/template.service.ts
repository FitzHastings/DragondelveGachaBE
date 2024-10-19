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

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PagedEntities } from '../common/dtos/paged-entities.dto';
import { generatePagingOptions } from '../common/utils/generate-paging-options';
import { PeekDto } from '../common/dtos/peek.dto';

import { CharacterTemplate } from './entities/character-template.entity';
import { UpdateCharacterTemplateDto } from './dtos/update-character-template.dto';

/**
 * Service that provides operations for managing character templates.
 */
@Injectable()
export class TemplateService {
    public constructor(@InjectRepository(CharacterTemplate) private readonly templateRepository: Repository<CharacterTemplate>) {
    }

    /**
     * Retrieves a paginated list of CharacterTemplate entities.
     *
     * @param {number} [page] - The page number to retrieve.
     * @param {number} [limit] - The number of items per page.
     * @returns {Promise<PagedEntities<CharacterTemplate>>} A promise that resolves to an object containing the entities and the total count.
     */
    public async findAll(page?: number, limit?: number): Promise<PagedEntities<CharacterTemplate>> {
        const [ entities, total ] = await this.templateRepository.findAndCount({
            relations: ['rarity', 'setting', 'smallImage'],
            ...generatePagingOptions(page, limit)
        });
        return { entities, total };
    }

    /**
     * Retrieves all template records from the repository with only the 'id' and 'name' fields selected.
     *
     * @return {Promise<PeekDto[]>} A promise that resolves to an array of PeekDto objects containing the 'id' and 'name' of each template.
     */
    public async peekAll(): Promise<PeekDto[]> {
        return await this.templateRepository.find({ select: ['id', 'name'] });
    }

    /**
     * Finds a single CharacterTemplate by its unique identifier.
     *
     * @param {number} id - The unique identifier of the CharacterTemplate to be found.
     * @return {Promise<CharacterTemplate>} A promise that resolves to the found CharacterTemplate.
     */
    public async findOne(id: number): Promise<CharacterTemplate> {
        return await this.templateRepository.findOne({
            where: { id },
            relations: ['rarity', 'setting', 'fullImage', 'smallImage']
        });
    }

    /**
     * Creates and saves a new character template.
     *
     * @param {CharacterTemplate} template - The character template to be created and saved.
     * @return {Promise<CharacterTemplate>} A promise that resolves to the saved character template.
     */
    public async create(template: CharacterTemplate): Promise<CharacterTemplate> {
        return await this.templateRepository.save(template);
    }

    /**
     * Updates an existing character template with the provided patch data.
     *
     * @param {number} id - The ID of the character template to update.
     * @param {UpdateCharacterTemplateDto} patchTemplate - The data to update the character template with.
     * @return {Promise<CharacterTemplate>} - A promise that resolves to the updated character template.
     * @throws {NotFoundException} - If the character template with the specified ID does not exist.
     */
    public async update(id: number, patchTemplate: UpdateCharacterTemplateDto): Promise<CharacterTemplate> {
        const template = await this.templateRepository.findOne({ where: { id } });
        if (!template) throw new NotFoundException(`Character Template #${id} does not exist`);

        const patchedRarity = { ...template, ...patchTemplate };
        return await this.templateRepository.save(patchedRarity);
    }

    /**
     * Deletes a record by its unique identifier using a soft delete mechanism.
     *
     * @param {number} id - The unique identifier of the record to delete.
     * @return {Promise<void>} A promise that resolves once the delete operation is complete.
     */
    public async delete(id: number): Promise<void> {
        await this.templateRepository.softDelete(id);
    }
}
