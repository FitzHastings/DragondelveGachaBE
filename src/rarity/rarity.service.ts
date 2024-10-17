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

import { PatchRarityDto } from './dtos/patch-rarity.dto';
import { Rarity } from './entities/rarity.entity';

/**
 * Service class for managing Rarity entities.
 */
@Injectable()
export class RarityService {
    public constructor(@InjectRepository(Rarity) private readonly rarityRepository: Repository<Rarity>) {
    }

    /**
     * Retrieves a paginated list of Rarity entities.
     *
     * @param {number} page - The page number to retrieve.
     * @param {number} limit - The number of items per page.
     * @return {Promise<PagedEntities<Rarity>>} A promise that resolves to an object containing the list of entities and the total count.
     */
    public async findAll(page?: number, limit?: number): Promise<PagedEntities<Rarity>> {
        const [ entities, total ] = await this.rarityRepository.findAndCount({
            ...generatePagingOptions(page, limit)
        });
        return { entities, total };
    }

    /**
     * Retrieves a list of all available records from the repository, selecting only the 'id' and 'name' properties.
     *
     * @return {Promise<PeekDto[]>} A promise that resolves to an array of PeekDto objects containing the selected properties.
     */
    public async peekAll(): Promise<PeekDto[]> {
        return await this.rarityRepository.find({ select: ['id', 'name'] });
    }

    /**
     * Fetches a single Rarity entity from the repository based on the provided ID.
     *
     * @param {number} id - The unique identifier of the Rarity entity to find.
     * @return {Promise<Rarity>} A promise that resolves to the found Rarity entity.
     */
    public async findOne(id: number): Promise<Rarity> {
        return await this.rarityRepository.findOne({ where: { id } });
    }

    /**
     * Creates a new rarity entry and saves it to the repository.
     *
     * @param rarity - The rarity object to be created and saved.
     * @return The saved rarity object.
     */
    public async create(rarity: Rarity): Promise<Rarity> {
        return await this.rarityRepository.save(rarity);
    }

    /**
     * Updates the rarity entity with the specified ID using the provided patch data.
     *
     * @param {number} id - The unique identifier of the rarity entity to be updated.
     * @param {PatchRarityDto} patchRarity - An object containing the properties to be updated in the rarity entity.
     * @return {Promise<Rarity>} The updated rarity entity.
     * @throws {NotFoundException} If the rarity entity with the specified ID does not exist.
     */
    public async update(id: number, patchRarity: PatchRarityDto): Promise<Rarity> {
        const rarity = await this.rarityRepository.findOne({ where: { id } });
        if (!rarity) throw new NotFoundException(`Rarity #${id} does not exist`);

        const patchedRarity = { ...rarity, patchRarity };
        return await this.rarityRepository.save(patchedRarity);
    }

    /**
     * Deletes a record with the given ID using a soft delete operation.
     *
     * @param {number} id - The ID of the record to be deleted.
     * @return {Promise<void>} A promise that resolves when the delete operation is complete.
     */
    public async delete(id: number): Promise<void> {
        await this.rarityRepository.softDelete(id);
    }
}
