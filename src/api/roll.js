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
    template.id = template._id;
    delete template._id;
    res.json({
        name: template.name,
        id: 1,
        template: template,
    });
}
