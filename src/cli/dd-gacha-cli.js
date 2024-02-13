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

import { program } from 'commander';
import mongoose from 'mongoose';
import chalk from 'chalk';
import dotenv from 'dotenv';
import Template from '../models/Template.js';
import rarity from '../utils/rarity.js';
import * as console from 'console';
import * as fs from 'fs';

async function connectToMongo() {
    const uri = `mongodb://${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_NAME}`;

    console.log(chalk.cyan(`Connecting to MongoDB at: ${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}`));
    mongoose.connect(uri).then(() => {
        console.log(chalk.green(`Successfully connected to MongoDB at: ${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}`));
    }).catch((err) => {
        console.error(chalk.red('Failed to connect to MongoDB', err));
        throw err;
    });

}

async function assembleData(directory) {
    let isValid = true;
    if (!fs.existsSync(`${directory}/info.json`)) {
        console.error(chalk.red('ERROR: info.json not found in directory'));
        isValid = false;
    }

    if (!fs.existsSync(`${directory}/full.png`)) {
        console.error(chalk.red('ERROR: full.png not found in directory'));
        isValid = false;
    }

    if (!isValid) throw new Error('Invalid Data');

    const info = JSON.parse(fs.readFileSync(`${directory}/info.json`).toString('utf8'));
    if (typeof info.name !== 'string') {
        console.error(chalk.red('ERROR: info.name must be a string'));
        isValid = false;
    }

    if (typeof info.description !== 'string') {
        console.error(chalk.red('ERROR: info.description must be a string'));
        isValid = false;
    }

    if (typeof info.rarity !== 'string') {
        console.error(chalk.red('ERROR: info.rarity must be a string'));
        isValid = false;
    }

    if (typeof info.setting !== 'string') {
        console.error(chalk.red('ERROR: info.setting must be a string'));
        isValid = false;
    }

    if (!isValid)
        throw new Error('info.json is invalid');

    let rarityIsValid = false;
    for (const rar in rarity) {
        if (rar === info.rarity) {
            rarityIsValid = true;
            break;
        }
    }

    if (!rarityIsValid)
        throw new Error('Rarity is an invalid value');

    return info;
}

function copyFiles(directory, templateId) {
    fs.mkdirSync(`public/${templateId}`);
    fs.copyFileSync(`${directory}/full.png`, `public/${templateId}/full.png`);
}

dotenv.config();

program
    .version('1.0.0')
    .description('A simple CLI application for adding new templates');

program
    .command('crtmp <directory>')
    .description('Creates a new Template from the directory provided')
    .action(async (directory) => {
        if (!fs.opendirSync(directory)) {
            console.log(chalk.red(`Error: ${directory} is not a directory`));
            return;
        }

        const template = await assembleData(directory);
        await connectToMongo();
        await Template.create(template).then((template) => {
            const templateId = template._id;
            console.log(chalk.green(`Template created with ID: ${templateId}`));
            copyFiles(directory, templateId);
        }).catch((err) => {
            console.error('Failed to create a template!', err);
        });
        await mongoose.disconnect();
    });

program.parse(process.argv);
