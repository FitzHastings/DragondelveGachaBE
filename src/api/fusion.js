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

import Character from '../models/Character.js';
import Template from '../models/Template.js';
import Fusion from '../models/Fusion.js';
import onStarsSpent from '../utils/onStarsSpent.js';
import report from '../report.js';
import chalk from 'chalk';

export async function findAllAvailableFusions(req, res) {
    const user = req.body.from;
    const formattedResponse = [];
    const allFusions = await Fusion.find();
    for (const fusion of allFusions) {
        let showFusion = false;
        const templatePromises = [];

        const formattedFusion = {
            id: fusion._id,
            cost: fusion.cost,
            name: fusion.name,
            templates: [],
        };

        for (const template of fusion.templateIds) {
            templatePromises.push(
                Character.findOne({ ownerId: user.id, templateId: template._id }).then((character) => {
                    if (character) {
                        showFusion = true;
                        formattedFusion.templates.push({
                            id: template._id,
                            name: template.name,
                            rarity: template.rarity,
                            setting: template.setting,
                        });
                    } else {
                        formattedFusion.templates.push({
                            id: 'unkown-template',
                            rarity: template.rarity,
                            setting: template.setting,
                        });
                    }
                })
            );
        }

        await Promise.all(templatePromises);
        if (!showFusion) continue;

        formattedResponse.push(formattedFusion);
    }

    res.json(formattedResponse);
}

export async function performFusion(req, res) {
    const user = req.body.from;
    const fusionId = req.params.fusionId;

    const fusion = await Fusion.findById(fusionId);
    const characters = [];
    for (const templateId of fusion.templateIds)
        characters.push(Character.findOne({ ownerId: user.id, templateId }));
    await Promise.all(characters);

    const template = await Template.findById(fusion.resultTemplateId);

    for (const character of characters) {
        if (!character) {
            report.warn(
                chalk.yellow('fusion attempted by')
                + chalk.magenta(user.id)
                + chalk.yellow('but he lacks a character for that fusion'));
            res.status(400).send('Bad Request');
            return;
        }
    }

    onStarsSpent(req.body.from.id, fusion.cost);

    for (const character of characters)
        Character.deleteOne({ _id: character._id });

    const character = await Character.create({
        name: template.name,
        templateId: template._id,
        ownerId: user.id,
    });

    const fusionResult = character.toObject();
    fusionResult.id = fusionResult._id;
    fusionResult.template = template;
    fusionResult.template.id = fusionResult.template._id;
    delete fusionResult.template._id;
    delete fusionResult._id;
    res.json(fusionResult);

    report.info(
        chalk.green('User ')
        + chalk.magenta(req.body.from.identity)
        + chalk.green(' fused: ')
        + chalk.magenta(template.name)
    );
}
