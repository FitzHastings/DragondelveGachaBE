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

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { PagedEntities } from '../common/dtos/paged-entities.dto';
import { PeekDto } from '../common/dtos/peek.dto';
import { IsAdminGuard } from '../auth/guards/is-admin';
import { SettingWorld } from '../world/entities/setting-world.entity';

import { PatchRarityDto } from './dtos/patch-rarity.dto';
import { RarityService } from './rarity.service';
import { Rarity } from './entities/rarity.entity';

/**
 * RarityController handles all endpoints related to rarity.
 */
@Controller('rarity')
export class RarityController {
    public constructor(private readonly rarityService: RarityService) {
    }

    /**
     * Fetches all rarity entries, with optional pagination.
     *
     * @param {number} [page] - Optional page number requested for pagination.
     * @param {number} [limit] - Optional page size requested for pagination.
     * @return {Promise<PagedEntities<Rarity>>} A promise that resolves to a paginated list of rarities.
     */
    @ApiOperation({ summary: 'Get All Rarities' })
    @ApiOkResponse({ type: Rarity, description: 'All Rarities', isArray: true })
    @ApiQuery({ name: 'page', required: false, description: 'Optional page number requested' })
    @ApiQuery({ name: 'limit', required: false, description: 'Optional page size requested' })
    @ApiBearerAuth()
    @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
    @UseGuards(JwtGuard, IsAdminGuard)
    @Get('/')
    public async findAll(@Query('page') page?: number, @Query('limit') limit?: number): Promise<PagedEntities<Rarity>> {
        return await this.rarityService.findAll(page, limit);
    }

    /**
     * Retrieves a list of all rarities in the system.
     *
     * @return {Promise<PeekDto[]>} A promise that resolves to an array of PeekDto objects representing the rarities.
     */
    @ApiOperation({ summary: 'Peek At All Rarities in the System' })
    @ApiOkResponse({ type: PeekDto, description: 'Peek at Rarities' })
    @ApiBearerAuth()
    @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
    @UseGuards(JwtGuard)
    @Get('/peek')
    public async peekAll(): Promise<PeekDto[]> {
        return await this.rarityService.peekAll();
    }

    /**
     * Retrieves the details of a Rarity by its unique identifier.
     *
     * @param {number} id - The unique identifier of the Rarity.
     * @return {Promise<Rarity>} A promise that resolves to the Rarity details.
     */
    @ApiOperation({ summary: 'Get Rarity Details by Id' })
    @ApiParam({ name: 'id', description: 'Id of the Rarity' })
    @ApiOkResponse({ type: Rarity, description: 'Rarity with all details' })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
    @ApiBearerAuth()
    @UseGuards(JwtGuard, IsAdminGuard)
    @Get('/:id')
    public async findOne(@Param('id') id: number): Promise<Rarity> {
        return await this.rarityService.findOne(id);
    }

    /**
     * Creates a new rarity.
     *
     * @param {Rarity} rarity - The rarity data to create.
     * @return {Promise<Rarity>} The created rarity.
     */
    @ApiOperation({ summary: 'Create a New Rarity' })
    @ApiBody({ type: Rarity, description: 'Rarity Data to create' })
    @ApiOkResponse({ type: Rarity, description: 'Created Rarity' })
    @ApiBearerAuth()
    @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
    @UseGuards(JwtGuard, IsAdminGuard)
    @Post('/')
    public async create(@Body() rarity: Rarity): Promise<Rarity> {
        return await this.rarityService.create(rarity);
    }

    /**
     * Updates the rarity based on the provided ID and update data.
     *
     * @param {number} id - The ID of the rarity to be updated.
     * @param {Rarity} brand - The data to update the rarity with.
     * @return {Promise<Rarity>} The updated rarity object.
     */
    @ApiBody({ type: PatchRarityDto, description: 'Rarity Fields to be updated' })
    @ApiOperation({ summary: 'Update Rarity' })
    @ApiParam({ name: 'id', description: 'Id of the Rarity to be updated' })
    @ApiOkResponse({ type: SettingWorld, description: 'Updated Rarity' })
    @ApiBearerAuth()
    @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
    @UseGuards(JwtGuard, IsAdminGuard)
    @Patch('/:id')
    public async update(@Param('id') id: number, @Body() brand: Rarity): Promise<Rarity> {
        return await this.rarityService.update(id, brand);
    }

    /**
     * Deletes a rarity by its ID.
     *
     * @param {number} id - The ID of the rarity to be deleted.
     * @return {Promise<void>} A promise that resolves when the rarity has been deleted.
     */
    @ApiOperation({ summary: 'Delete Rarity' })
    @ApiParam({ name: 'id', description: 'Id of the rarity to be deleted' })
    @ApiOkResponse({ description: 'No Data' })
    @ApiBearerAuth()
    @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
    @UseGuards(JwtGuard, IsAdminGuard)
    @Delete('/:id')
    public async delete(@Param('id') id: number): Promise<void> {
        return await this.rarityService.delete(id);
    }
}
