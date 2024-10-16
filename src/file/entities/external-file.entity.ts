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

import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { GeneralEntity } from '../../common/entities/general.entity';
import { User } from '../../user/entities/user.entity';
import { SettingWorld } from '../../world/entities/setting-world.entity';

/**
 * Represents an external file.
 *
 * @class
 * @extends GeneralEntity
 */
@Entity('files')
export class ExternalFile extends GeneralEntity {
    /**
     * Represents the filename of a file.
     *
     * @typed {string} Filename
     */
    @ApiProperty({ type: String, description: 'name of the file (Read Only)', example: 'something-something.png' })
    @Column()
    public filename: string;

    /**
     * Encodes the given string using a specific encoding algorithm.
     *
     * @param {string} str - The string to be encoded.
     * @returns {string} The encoded string.
     */
    @ApiProperty({ type: String, description: 'encoding of the file (Read Only)', example: 'UTF-8' })
    @Column()
    public encoding: string;

    /**
     * Represents a file path.
     *
     * @type {string} Path
     */
    @ApiProperty({ type: String, description: 'path to the file (Read Only)', example: '/public/static/banner.jpg' })
    @Column()
    public path: string;

    /**
     * Represents the size of a variable.
     *
     * @type {number} Size
     */
    @Column()
    @ApiProperty({ type: Number, description: 'Filesize in bytes (Read Only)', example: 65536 })
    public size: number;

    /**
     * Represents the MIME type of a resource.
     *
     * @type {string} MimeType
     */
    @Column()
    @ApiProperty({ type: String, description: 'MIME media type of the file (Read Only)', example: 'image' })
    public mimetype: string;

    /**
     * Represents an array of User objects.
     *
     * @type {User[]} Users
     */
    @OneToMany(() => User, (user) => user.image, { onDelete: 'CASCADE' })
    public users: User[];

    /**
     * An array of `SettingWorld` objects.
     *
     * @type {SettingWorld[]}
     */
    @ManyToMany(() => SettingWorld, (settingWorld) => settingWorld.images)
    public settings: SettingWorld[];

    /**
     * An array of SettingWorld objects.
     * @type {SettingWorld[]}
     */
    @OneToMany(() => SettingWorld, (settingWorld) => settingWorld.logo)
    public setting: SettingWorld[];
}
