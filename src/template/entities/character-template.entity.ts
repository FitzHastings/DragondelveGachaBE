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

import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { GeneralEntity } from '../../common/entities/general.entity';
import { Rarity } from '../../rarity/entities/rarity.entity';
import { ExternalFile } from '../../file/entities/external-file.entity';
import { SettingWorld } from '../../world/entities/setting-world.entity';
import { Character } from '../../character/entities/character.entity';

/**
 * Represents a template for a character entity.
 * This class includes properties that describe the character's name, description,
 * notable quote, rollability, and rarity.
 */
@Entity('character_templates')
export class CharacterTemplate extends GeneralEntity {
    /**
     * Represents the name of a person or entity.
     *
     * @type {string}
     */
    @ApiProperty({ description: 'Name of this Character Template', type: String, example: 'common' })
    @IsNotEmpty()
    @IsString()
    @Column()
    public name: string;

    /**
     * A variable that holds a textual description.
     * Can be used for storing any descriptive text.
     * Example: "This is a description of a product."
     *
     * @type {string}
     */
    @ApiProperty({ description: 'Description of character', type: String, example: 'Character is very cool and strong and smart' })
    @IsString()
    @IsNotEmpty()
    @Column()
    public description: string;

    /**
     * A string containing a quotation.
     * This variable is intended to store a quote, which can be used for displaying a notable saying
     * or phrase in applications such as quote of the day features, motivational messages, etc.
     *
     * @type {string}
     */
    @ApiProperty({ description: 'Quote of character', type: String, example: 'Hello!' })
    @IsString()
    @IsNotEmpty()
    @Column()
    public quote: string;

    /**
     * A boolean indicating whether an object can be rolled for in roll API.
     */
    @ApiPropertyOptional({ description: 'Indicates whether a template can be rolled for in roll API', type: Boolean, example: true })
    @IsBoolean()
    @IsOptional()
    @Column({ default: 'false', name: 'is_rollable' })
    public isRollable?: boolean;

    /**
     * Represents the rarity level of a template within the system
     * @type {Rarity}
     */
    @ManyToOne(() => Rarity, (rarity) => rarity.templates)
    @JoinColumn({ name: 'rarity_id' })
    public rarity: Rarity;

    /**
     * Represents the identifier for the rarity level of an item.
     *
     * This unique identifier is used to differentiate between various levels of rarity
     * for items within the system. Each rarity level is assigned a distinct numerical value
     * that signifies its scarcity and value.
     *
     * @type {number}
     */
    @ApiProperty({ description: 'Rarity id of this template', type: Number, example: 1 })
    @IsInt()
    @IsPositive()
    @Column({ nullable: true, name:'rarity_id' })
    public rarityId: number;

    /**
     * Setting for managing world configuration in the application.
     * @type {SettingWorld}
     */
    @ManyToOne(() => SettingWorld, (settingWorld) => settingWorld.templates)
    @JoinColumn({ name: 'setting_id' })
    public setting: SettingWorld;

    /**
     * Unique identifier for a specific setting.
     * @type {number}
     */
    @ApiProperty({ description: 'id of full image external file', type: Number, example: 26 })
    @IsInt()
    @IsPositive()
    @Column({ nullable: true, name: 'setting_id' })
    public settingId: number;

    /**
     * Represents an external file that contains the full image data
     * @name fullImage
     * @type {ExternalFile}
     */
    @ManyToOne(() => ExternalFile, (externalFile) => externalFile.templatesFull)
    @JoinColumn({ name: 'full_image_id' })
    public fullImage: ExternalFile;

    /**
     * Represents the unique identifier for a full image.
     * @type {number}
     */
    @ApiPropertyOptional({ description: 'id of full image external file', type: Number, example: 50 })
    @IsInt()
    @IsPositive()
    @IsOptional()
    @Column({ nullable: true, name: 'full_image_id' })
    public fullImageId: number;

    /**
     * An array containing instances of characters rolled from this Template
     * @type {Character[]}
     */
    @OneToMany(() => Character, (character) => character.template)
    public characters: Character[];
}