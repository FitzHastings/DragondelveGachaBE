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

import express from 'express';
import log from './loggers.js';
import {getRoll} from './api/roll.js';
import chalk from 'chalk';
import cors from 'cors';

export default async function setupAPI () {
    const app = express();
    const port = process.env.PORT;
    log.info(chalk.cyan('API Server starting up'));

    app.use(cors());

    app.get('/roll', getRoll);

    await app.listen(port, () => {
        log.info(chalk.green(`API Server is running on ${port}`));
    });
}
