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
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { PeekDto } from '../common/dtos/peek.dto';
import { IsAdminGuard } from '../auth/guards/is-admin';

import { WorldService } from './world.service';
import { SettingWorld } from './entities/setting-world.entity';
import { UpdateSettingDto } from './dtos/update-setting.dto';

/**
 * Controller for handling world-related operations.
 */
@ApiTags('Setting World Module')
@Controller('world')
export class WorldController {
    /**
     * Constructs an instance of the class.
     * @param {WorldService} worldService - The world service instance to be used by this class.
     */
    public constructor(private readonly worldService: WorldService) {
    }

    /**
     * Retrieves all setting worlds.
     *
     * @return {Promise<SettingWorld[]>} A promise that resolves to an array of setting worlds.
     */
    @ApiOperation({ summary: 'Get All Settings' })
    @ApiOkResponse({ type: SettingWorld, description: 'All Settings and their logos', isArray: true })
    @ApiQuery({ name: 'page', required: false, description: 'Optional page number requested' })
    @ApiQuery({ name: 'limit', required: false, description: 'Optional page size requested' })
    @ApiBearerAuth()
    @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
    @UseGuards(JwtGuard)
    @Get('/')
    public async findAll(@Query('page') page?: number, @Query('limit') limit?: number): Promise<SettingWorld[]> {
        return await this.worldService.findAll(page, limit);
    }

    /**
     * Retrieves a list of all available PeekDto objects.
     * Employs JwtGuard to ensure that the endpoint is protected.
     * Handles GET requests sent to the '/peek' route.
     *
     * @return {Promise<PeekDto[]>} A promise that resolves to an array of PeekDto objects.
     */
    @ApiOperation({ summary: 'Get Category Details by Id' })
    @ApiOkResponse({ type: PeekDto, description: 'Peek at Settings' })
    @ApiBearerAuth()
    @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
    @UseGuards(JwtGuard)
    @Get('/peek')
    public async peekAll(): Promise<PeekDto[]> {
        return await this.worldService.peekAll();
    }

    /**
     * Retrieves a specific SettingWorld by its ID.
     *
     * @param {number} id - The ID of the SettingWorld to retrieve.
     * @return {Promise<SettingWorld>} A promise that resolves to the retrieved SettingWorld.
     */
    @ApiOperation({ summary: 'Get Setting Details by Id' })
    @ApiParam({ name: 'id', description: 'Id of the Setting' })
    @ApiOkResponse({ type: SettingWorld, description: 'Setting World with all details' })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Get('/:id')
    public async findOne(@Param('id') id: number): Promise<SettingWorld> {
        return await this.worldService.findOne(id);
    }

    /**
     * Creates a new SettingWorld.
     *
     * @param {SettingWorld} settingWorld - The SettingWorld object to be created.
     * @return {Promise<SettingWorld>} - A promise that resolves to the created SettingWorld object.
     */
    @ApiOperation({ summary: 'Create a New Setting' })
    @ApiBody({ type: SettingWorld, description: 'Setting Data to create' })
    @ApiOkResponse({ type: SettingWorld, description: 'Created Setting' })
    @ApiBearerAuth()
    @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
    @UseGuards(JwtGuard, IsAdminGuard)
    @Post('/')
    public async create(@Body() settingWorld: SettingWorld): Promise<SettingWorld> {
        return await this.worldService.create(settingWorld);
    }

    /**
     * Updates a setting with the specified ID using the provided data.
     *
     * @param {number} id - Id of the Setting to be updated.
     * @param {UpdateSettingDto} updateSettingDto - Data transfer object containing the new values.
     *
     * @return {Promise<SettingWorld>} A promise that resolves to the updated Setting object.
     */
    @ApiBody({ type: UpdateSettingDto })
    @ApiOperation({ summary: 'Update Setting' })
    @ApiParam({ name: 'id', description: 'Id of the Setting to be updated' })
    @ApiOkResponse({ type: SettingWorld, description: 'Updated Setting' })
    @ApiBearerAuth()
    @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
    @UseGuards(JwtGuard, IsAdminGuard)
    @Patch('/:id')
    public async update(@Param('id') id: number, @Body() updateSettingDto: UpdateSettingDto): Promise<SettingWorld> {
        return await this.worldService.update(id, updateSettingDto);
    }

    /**
     * Deletes a category based on its ID.
     *
     * @param {number} id - The ID of the category to be deleted.
     * @return {Promise<void>} A promise that resolves when the category is successfully deleted.
     */
    @ApiOperation({ summary: 'Delete Setting' })
    @ApiParam({ name: 'id', description: 'Id of the setting to be deleted' })
    @ApiOkResponse({ description: 'No Data' })
    @ApiBearerAuth()
    @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
    @UseGuards(JwtGuard, IsAdminGuard)
    @Delete('/')
    public async remove(@Param('id') id: number): Promise<void> {
        return await this.worldService.remove(id);
    }
}
