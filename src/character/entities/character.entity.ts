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

import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { GeneralEntity } from '../../common/entities/general.entity';
import { User } from '../../user/entities/user.entity';
import { CharacterTemplate } from '../../template/entities/character-template.entity';

/**
 * Represents a Character entity in the application.
 * This entity is related to the CharacterTemplate and User entities.
 */
@Entity('characters')
export class Character extends GeneralEntity {
    /**
    * Represents the name of a character (User Specific)
    * @type {string}
    */
    @ApiPropertyOptional({ description: 'Name of the character', type: String, example: 'Lenz Manzikert' })
    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    public name: string;

    /**
    * The CharacterTemplate object represents a template for creating character instances
    * @type {CharacterTemplate}
    */
    @ApiPropertyOptional({ description: 'Template of the character (Read Only)', type: () => CharacterTemplate })
    @ManyToOne(() => CharacterTemplate, (characterTemplate) => characterTemplate.characters)
    @JoinColumn({ name: 'template_id' })
    public template: CharacterTemplate;

    /**
    * Identifier for a specific template. This variable holds a number that uniquely
    * references a particular template within the system.
    *
    * @type {number}
    */
    @Column({ nullable: true, name: 'template_id' })
    public templateId: number;

    /**
    * Represents the owner of this character
    * @type {User}
    */
    @ApiPropertyOptional({ description: 'Owner of the Character (Read Only)', type: () => User })
    @ManyToOne(() => User, (user) => user.characters)
    @JoinColumn({ name: 'owner_id' })
    public owner: User;

    /**
    * Represents the unique identifier of the owner.
    * This is typically used to reference the owner of a particular resource.
    *
    * @type {number}
    */
    @Column({ nullable: true, name: 'owner_id' })
    public ownerId: number;
}