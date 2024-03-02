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

import rarity from '../utils/rarity.js';
import templateCache from '../cache/CharacterPool.js';
import Character from '../models/Character.js';
import onEnergySpent from '../utils/onEnergySpent.js';
import log from '../loggers.js';
import chalk from 'chalk';

function rollForRarity() {
    const randomNumber = Math.floor(Math.random() * 100) + 1;

    if (randomNumber <= 5)
        return rarity.legendary;
    if (randomNumber <= 15)
        return rarity.epic;
    if (randomNumber <= 35)
        return rarity.rare;
    if (randomNumber <= 65)
        return rarity.uncommon;
    return rarity.common;
}

function rollAgainstPool() {
    const rarityPool = templateCache.byRarity.get(rollForRarity());
    const randomIndex = Math.floor(Math.random() * rarityPool.length);
    return rarityPool[randomIndex];
}

export function getRoll(req, res) {
    const template = rollAgainstPool().toObject();
    try {
        onEnergySpent(req.body.from.id);

        Character.create({
            name: template.name,
            templateId: template._id,
            ownerId: req.body.from.id,
        }).then((character) => {
            const rollResult = character.toObject();
            rollResult.id = rollResult._id;
            rollResult.template = template;
            rollResult.template.id = rollResult.template._id;
            delete rollResult.template._id;
            delete rollResult._id;
            res.json(rollResult);
        });
    } catch {
        log.error(chalk.red('Roll Failed'));
        res.status(500);
        res.end('Roll failed!');
    }
}
