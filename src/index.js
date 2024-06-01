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

import dotenv from 'dotenv';
import chalk from 'chalk';
import report from './report.js';
import connectToMongoose from './mongo.js';
import setupAPI from './api.js';
import templateCache from './cache/CharacterPool.js';
import mongoose from 'mongoose';
import settingCache from './cache/SettingCache.js';

async function startServer() {
    report.info(chalk.cyan('Dragondelve Gacha Server is Starting Up'));

    report.info(chalk.cyan('Loading env variables'));
    if (dotenv.config().error) {
        report.error(chalk.red('Error loading env variables'));
        throw new Error('Failed to Load env args');
    }
    report.info(chalk.green('Successfully loaded env variables'));

    await connectToMongoose();
    await templateCache.warm();
    await settingCache.warm();
    await setupAPI();
}

startServer().then(() => {
    report.info(chalk.green('Dragondelve Gacha Server Startup Complete'));
}).catch(() => {
    report.error(chalk.red('Dragondelve Gacha Server Failed Startup'));
    mongoose.disconnect();
});
