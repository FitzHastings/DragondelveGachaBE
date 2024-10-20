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

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FileModule } from '../file/file.module';

import { WorldController } from './world.controller';
import { WorldService } from './world.service';
import { SettingWorld } from './entities/setting-world.entity';

/**
 * WorldModule is a module in a NestJS application that is responsible
 * for managing world-related functional features.
 */
@Module({
    imports: [TypeOrmModule.forFeature([SettingWorld]), FileModule],
    controllers: [WorldController],
    providers: [WorldService]
})
export class WorldModule {}
