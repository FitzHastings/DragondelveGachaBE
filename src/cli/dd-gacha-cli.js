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

import {program} from 'commander';
import mongoose from 'mongoose';
import chalk from 'chalk';
import dotenv from 'dotenv';
import Template from '../models/Template.js';
import rarity from '../utils/rarity.js';
import * as console from 'console';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import User from '../models/User.js';

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

function checkValidity(directory) {
    console.log(`Checking ${directory}`);
    if (!fs.existsSync(`${directory}/info.json`)) {
        console.error(chalk.red('ERROR: info.json not found in directory'));
        return false;
    }

    if (!fs.existsSync(`${directory}/full.png`)) {
        console.error(chalk.red('ERROR: full.png not found in directory'));
        return false;
    }

    const info = JSON.parse(fs.readFileSync(`${directory}/info.json`).toString('utf8'));
    if (typeof info.name !== 'string') {
        console.error(chalk.red('ERROR: info.name must be a string'));
        return false;
    }

    if (typeof info.description !== 'string') {
        console.error(chalk.red('ERROR: info.description must be a string'));
        return false;
    }

    if (typeof  info.quote !== 'string') {
        console.error(chalk.red('ERROR: info.quote must be a string'));
        return false;
    }

    if (typeof info.rarity !== 'string') {
        console.error(chalk.red('ERROR: info.rarity must be a string'));
        return false;
    }

    if (typeof info.setting !== 'string') {
        console.error(chalk.red('ERROR: info.setting must be a string'));
        return false;
    }

    let rarityIsValid = false;
    for (const rar in rarity) {
        if (rar === info.rarity) {
            rarityIsValid = true;
            break;
        }
    }

    if (!rarityIsValid) {
        console.error('Rarity is an invalid value');
        return false;
    }

    console.log(chalk.green('OK'));
    return true;
}

async function assembleData(directory) {
    if (!checkValidity(directory)) return;

    return JSON.parse(fs.readFileSync(`${directory}/info.json`).toString('utf8'));
}

function copyFiles(directory, templateId) {
    console.log(chalk.cyan('Copying image files for ') + chalk.magenta(templateId));
    fs.mkdirSync(`public/${templateId}`);
    fs.copyFileSync(`${directory}/full.png`, `public/${templateId}/full.png`);
    sharp(`${directory}/full.png`)
        .resize(280, 403)
        .toFile(`public/${templateId}/small.png`, (err) => {
            if (err) {
                console.error(chalk.red('Failed to create thumbnail', err));
            } else {
                console.log(chalk.green('Image compressed successfully'));
            }
        });
    console.log(chalk.green('Successfully copied image files for ') + chalk.magenta(templateId));
}

async function doTemplate(directory) {
    console.log(`creating a template from ${directory}`);
    if (!fs.opendirSync(directory)) {
        console.log(chalk.red(`Error: ${directory} is not a directory`));
        return;
    }

    const template = await assembleData(directory);
    await Template.create(template).then((template) => {
        const templateId = template._id;
        console.log(chalk.green(`Template created with ID: ${templateId}`));
        copyFiles(directory, templateId);
    }).catch((err) => {
        console.error('Failed to create a template!', err);
    });
}

dotenv.config();

program
    .version('1.0.0')
    .description('A simple CLI application for adding new templates');

program
    .command('crtmp <directory>')
    .description('Creates a new Template from the directory provided')
    .action(async (directory) => {

        await connectToMongo();
        const entities = fs.readdirSync(directory, {withFileTypes: true});
        // Filter out directories only
        const directories = entities.filter((dirent) => dirent.isDirectory());
        // Call doTemplate on each directory
        for (const dir of directories) {
            await doTemplate(path.join(directory, dir.name));
        }
        mongoose.disconnect();
    });

program
    .command('chech <directory>')
    .description('Checks if i\'s ok to run crtmp on this directory')
    .action(async (directory) => {
        const entities = fs.readdirSync(directory, {withFileTypes: true});
        // Filter out directories only
        const directories = entities.filter((dirent) => dirent.isDirectory());
        // Call checkValidity on each directory
        for (const dir of directories) {
            checkValidity(path.join(directory, dir.name));
        }
        console.log('Finished checking, if no errors popped up you should be ok to do crtp');
    });

program
    .command('gvnrg <id> <amount>')
    .description('Gives user with this id amount of energy')
    .action(async (id, amount) => {
        User.findById(id).then((user) => {
            user.currentEnergy += amount || 1;
            user.save().then(() => console.log('success'));
        });
    });

program.parse(process.argv);
