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

import { PeekDto } from '../common/dtos/peek.dto';
import { loadNestlingWithIds } from '../common/utils/load-nestlings';
import { ExternalFile } from '../file/entities/external-file.entity';
import { generatePagingOptions } from '../common/utils/generate-paging-options';
import { PagedEntities } from '../common/dtos/paged-entities.dto';

import { UpdateSettingDto } from './dtos/update-setting.dto';
import { SettingWorld } from './entities/setting-world.entity';

/**
 * Service handling operations for SettingWorld entities.
 */
@Injectable()
export class WorldService {
    /**
     * Constructs an instance of the class.
     *
     * @param {Repository<SettingWorld>} settingRepository - The repository for SettingWorld entities.
     * @param {Repository<ExternalFile>} externalFileRepository - The repository for ExternalFile entities.
     */
    public constructor(
        @InjectRepository(SettingWorld) private readonly settingRepository: Repository<SettingWorld>,
        @InjectRepository(ExternalFile) private readonly externalFileRepository: Repository<ExternalFile>
    ) {
    }

    /**
     * Fetches all SettingWorld entities from the settingRepository,
     * including their associated logos.
     *
     * @return {Promise<SettingWorld[]>} A promise that resolves to an array of SettingWorld entities with their logo relations.
     */
    public async findAll(page: number, limit: number): Promise<PagedEntities<SettingWorld>> {
        const [ entities, total ] = await this.settingRepository.findAndCount({
            relations: ['logo'],
            ...generatePagingOptions(page, limit)
        });
        return { entities, total };
    }

    /**
     * Retrieves a list of settings with their 'id' and 'name' properties.
     *
     * @return {Promise<PeekDto[]>} A promise that resolves to an array of settings.
     */
    public async peekAll(): Promise<PeekDto[]> {
        return await this.settingRepository.find({ select: ['id', 'name'] });
    }

    /**
     * Retrieves a single SettingWorld entity based on the provided ID.
     *
     * @param {number} id - The unique identifier of the SettingWorld entity to be retrieved.
     * @return {Promise<SettingWorld>} A promise containing the SettingWorld entity if found, otherwise null.
     */
    public async findOne(id: number): Promise<SettingWorld> {
        return await this.settingRepository.findOne({
            where: { id },
            relations: ['logo', 'images']
        });
    }

    /**
     * Asynchronously creates and saves a new setting world.
     *
     * @param {SettingWorld} settingWorld - The setting world entity to be saved.
     * @return {Promise<SettingWorld>} - A promise that resolves to the saved setting world entity.
     */
    public async create(settingWorld: SettingWorld): Promise<SettingWorld> {
        return await this.settingRepository.save(settingWorld);
    }

    /**
     * Updates an existing setting with new values.
     *
     * @param {number} id - The ID of the setting to be updated.
     * @param {UpdateSettingDto} settingWorld - The new values to update the setting with.
     * @return {Promise<SettingWorld>} - The updated setting.
     * @throws {NotFoundException} - If the setting with the specified ID does not exist.
     */
    public async update(id: number, settingWorld: UpdateSettingDto): Promise<SettingWorld> {
        const extantSetting = await this.settingRepository.findOne({ where: { id } });
        if (!extantSetting)
            throw new NotFoundException(`Setting #${settingWorld} does not exist`);
        const patchedSetting = { ...extantSetting, ...settingWorld };

        if (settingWorld.imageIds)
            extantSetting.images = await loadNestlingWithIds(settingWorld.imageIds, this.externalFileRepository) as ExternalFile[];

        return await this.settingRepository.save(patchedSetting);
    }

    /**
     * Removes a setting entry by soft deleting it from the repository.
     *
     * @param {number} id - The identifier of the setting entry to remove.
     * @return {Promise<void>} A promise that resolves when the operation is complete.
     */
    public async remove(id: number): Promise<void> {
        await this.settingRepository.softDelete(id);
    }
}
