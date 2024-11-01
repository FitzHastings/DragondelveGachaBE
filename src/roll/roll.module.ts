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

import { RarityModule } from '../rarity/rarity.module';
import { CharacterModule } from '../character/character.module';
import { TemplateModule } from '../template/template.module';
import { UserModule } from '../user/user.module';

import { RollController } from './roll.controller';
import { RollService } from './roll.service';

/**
 * The RollModule class is a module that organizes the roll-related functionality
 * within the application. It integrates various services, controllers, and other modules
 * to handle operations related to rolling for characters in the Gacha.
 */
@Module({
    controllers: [RollController],
    providers: [RollService],
    imports: [
        RarityModule,
        CharacterModule,
        TemplateModule,
        UserModule
    ]
})
export class RollModule {
}
