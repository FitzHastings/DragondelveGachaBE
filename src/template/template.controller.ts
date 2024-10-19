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

import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { IsAdminGuard } from '../auth/guards/is-admin';
import { PagedEntities } from '../common/dtos/paged-entities.dto';
import { PeekDto } from '../common/dtos/peek.dto';

import { TemplateService } from './template.service';
import { CharacterTemplate } from './entities/character-template.entity';
import { UpdateCharacterTemplateDto } from './dtos/update-character-template.dto';

/**
 * TemplateController handles all endpoints related to Character Templates.
 */
@ApiTags('Character Template Module')
@Controller('template')
export class TemplateController {
    public constructor(private readonly templateService: TemplateService) {
    }

    /**
     * Fetches all character templates with optional pagination.
     *
     * @param {number} [page] - Optional page number requested.
     * @param {number} [limit] - Optional page size requested.
     * @return {Promise<PagedEntities<CharacterTemplate>>} - A promise resolving to a paged list of character templates.
     */
    @ApiOperation({ summary: 'Get All Templates' })
    @ApiOkResponse({ type: CharacterTemplate, description: 'All Templates', isArray: true })
    @ApiQuery({ name: 'page', required: false, description: 'Optional page number requested' })
    @ApiQuery({ name: 'limit', required: false, description: 'Optional page size requested' })
    @ApiBearerAuth()
    @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
    @UseGuards(JwtGuard, IsAdminGuard)
    @Get('/')
    public async findAll(@Query('page') page?: number, @Query('limit') limit?: number): Promise<PagedEntities<CharacterTemplate>> {
        return await this.templateService.findAll(page, limit);
    }

    /**
     * Fetches a preview of all templates available in the system.
     *
     * This method retrieves a list of templates without loading their full details,
     * providing a lightweight way to view available options.
     *
     * @return {Promise<PeekDto[]>} A promise that resolves to an array of PeekDto objects,
     * representing the summaries of the templates.
     */
    @ApiOperation({ summary: 'Peek At All Templates in the System' })
    @ApiOkResponse({ type: PeekDto, description: 'Peek at Templates' })
    @ApiBearerAuth()
    @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
    @UseGuards(JwtGuard)
    @Get('/peek')
    public async peekAll(): Promise<PeekDto[]> {
        return await this.templateService.peekAll();
    }

    /**
     * Retrieves the details of a Character Template by its ID.
     *
     * @param {number} id - The ID of the Character Template to retrieve.
     * @return {Promise<CharacterTemplate>} A promise that resolves to the details of the Character Template.
     */
    @ApiOperation({ summary: 'Get Template Details by Id' })
    @ApiParam({ name: 'id', description: 'Id of the Rarity' })
    @ApiOkResponse({ type: CharacterTemplate, description: 'Template with all details' })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
    @ApiBearerAuth()
    @UseGuards(JwtGuard, IsAdminGuard)
    @Get('/:id')
    public async findOne(@Param('id') id: number): Promise<CharacterTemplate> {
        return await this.templateService.findOne(id);
    }

    /**
     * Create a new character template.
     *
     * @param {CharacterTemplate} template - The data of the template to be created.
     * @return {Promise<CharacterTemplate>} The newly created character template.
     */
    @ApiOperation({ summary: 'Create a New Template' })
    @ApiBody({ type: CharacterTemplate, description: 'Template Data to create' })
    @ApiOkResponse({ type: CharacterTemplate, description: 'Created Template' })
    @ApiBearerAuth()
    @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(JwtGuard, IsAdminGuard)
    @Post('/')
    public async create(@Body() template: CharacterTemplate): Promise<CharacterTemplate> {
        return await this.templateService.create(template);
    }

    /**
     * Updates a character template with the provided template data.
     *
     * @param {number} id - The ID of the template to be updated.
     * @param {UpdateCharacterTemplateDto} template - The updated template data.
     * @return {Promise<CharacterTemplate>} The updated character template.
     */
    @ApiBody({ type: UpdateCharacterTemplateDto, description: 'Template Fields to be updated' })
    @ApiOperation({ summary: 'Update Template' })
    @ApiParam({ name: 'id', description: 'Id of the Template to be updated' })
    @ApiOkResponse({ type: CharacterTemplate, description: 'Updated Template' })
    @ApiBearerAuth()
    @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(JwtGuard, IsAdminGuard)
    @Patch('/:id')
    public async update(@Param('id') id: number, @Body() template: UpdateCharacterTemplateDto) : Promise<CharacterTemplate> {
        return await this.templateService.update(id, template);
    }

    /**
     * Delete a template by its ID.
     *
     * @param {number} id - The ID of the template to be deleted.
     * @return {Promise<void>} - A promise that resolves when the template is successfully deleted.
     */
    @ApiOperation({ summary: 'Delete Template' })
    @ApiParam({ name: 'id', description: 'Id of the template to be deleted' })
    @ApiOkResponse({ description: 'No Data' })
    @ApiBearerAuth()
    @ApiUnauthorizedResponse({ description: 'Invalid credentials provided' })
    @UseGuards(JwtGuard, IsAdminGuard)
    @Delete('/:id')
    public async delete(@Param('id') id: number): Promise<void> {
        return await this.templateService.delete(id);
    }
}
