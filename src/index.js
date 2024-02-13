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
import log from './loggers.js';
import connectToMongoose from './mongo.js';
import setupAPI from './api.js';

async function startServer() {
    log.info(chalk.cyan('Dragondelve Gacha Server is Starting Up'));

    log.info(chalk.cyan('Loading env variables'));
    if (dotenv.config().error) {
        log.error(chalk.red('Error loading env variables'));
        throw new Error(env);
    }
    log.info(chalk.green('Successfully loaded env variables'));

    await connectToMongoose();
    await setupAPI();
}

startServer().then(() => {
    log.info(chalk.green('Dragondelve Gacha Server Startup Complete'));
}).catch(() => {
    log.error(chalk.red('Dragondelve Gacha Server Failed Startup'))
});
