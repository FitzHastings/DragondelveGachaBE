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

import mongoose from 'mongoose';
import report from './report.js';
import chalk from 'chalk';

export default async function connectToMongoose() {
    const uri = `mongodb://${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_NAME}`;

    report.info(
        chalk.cyan('Connecting to MongoDB at: ')
        + chalk.magenta(process.env.MONGO_DB_HOST)
        + chalk.cyan(':')
        + chalk.magenta(process.env.MONGO_DB_PORT)
    );

    await mongoose.connect(uri).then(() => {
        report.info(
            chalk.green('Successfully connected to MongoDB at: ')
            + chalk.magenta(process.env.MONGO_DB_HOST)
            + chalk.green(':')
            + chalk.magenta(process.env.MONGO_DB_PORT)
        );
    }).catch((err) => {
        report.error(chalk.red('Failed to connect to MongoDB', err));
        throw err;
    });
}
