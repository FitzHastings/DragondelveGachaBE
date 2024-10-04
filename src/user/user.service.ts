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
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { PatchUserDto } from './dto/patch-user.dto';

const userOverviewFields: Array<keyof User> = [
    'id',
    'username'
];

const SALT_ROUNDS = 10;

/**
 * A service for managing user data.
 *
 * @public
 * @class
 */
@Injectable()
export class UserService {
    /**
     * Creates a new instance of the constructor.
     *
     * @param {Repository<User>} usersRepository - The repository object for User entity.
     */
    public constructor(@InjectRepository(User) private usersRepository: Repository<User>) {
    }

    /**
     * Registers a new user.
     *
     * @param {User} user - The user object containing email and password.
     * @returns {Promise<User>} - The newly registered user object.
     */
    public async create(user: User): Promise<User> {
        const existingUser = await this.usersRepository.findOne({ where: { username: user.username }, withDeleted: true });
        if (existingUser) throw new Error('User with this username already exists');

        user.password = await this.hashPassword(user.password);
        return await this.usersRepository.save(user);
    }

    /**
     * Update a user with the provided id using the given patchUserDto data.
     *
     * @param {number} id - The id of the user to update.
     * @param {PatchUserDto} patchUserDto - The data to update the user with.
     * @returns {Promise<User>} - The updated user.
     * @throws {NotFoundException} - If the user with the provided id does not exist.
     */
    public async patchUser(id: number, patchUserDto: PatchUserDto): Promise<User> {
        const user = await this.findOne(id);

        if (!user) throw new NotFoundException(`User #${id} not found`);
        if (patchUserDto.password)
            patchUserDto.password = await this.hashPassword(patchUserDto.password);

        const patchedUser = Object.assign(user, patchUserDto);
        await this.usersRepository.save(patchedUser);
        return patchedUser;
    }

    /**
     * Finds a user by email.
     *
     * @param {string} username - The username of the user to find.
     * @return {Promise<User>} - A promise that resolves to the found user, if found. Otherwise, resolves to undefined.
     */
    public async findByUsername(username: string): Promise<User> {
        return this.usersRepository.findOne({ where: { username } });
    }

    /**
     * Finds a user with the given id.
     *
     * @param {number} id - The id of the user to find.
     *
     * @return {Promise<User>} - A promise that resolves to the found user.
     */
    public async findOne(id: number): Promise<User> {
        return this.usersRepository.findOne({
            where: { id },
            relations: []
        });
    }

    /**
     * Finds all users in the database.
     *
     * @return {Promise<User[]>} A promise that resolves to an array of User objects representing all users found.
     */
    public async findAll(): Promise<User[]> {
        return this.usersRepository.find({
            select: userOverviewFields,
            relations: []
        });
    }

    /**
     * Deletes a user by the given id.
     *
     * @param {number} id - The id of the user to delete.
     * @return {Promise<void>} A promise that resolves when the user is deleted.
     */
    public async delete(id: number): Promise<void> {
        await this.usersRepository.softDelete(id);
    }


    /**
     * Hashes the given password using bcrypt.
     *
     * @param {string} password - The password to hash.
     * @private
     * @return {Promise<string>} - A promise that resolves to the hashed password.
     */
    private async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, SALT_ROUNDS);
    }
}
