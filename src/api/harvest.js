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
import rarity from '../utils/rarity.js';
import onStarsEarned from '../utils/onStarsEarned.js';

const rarityMap = new Map();
rarityMap.set(rarity.common, 100);
rarityMap.set(rarity.uncommon, 200);
rarityMap.set(rarity.rare, 300);
rarityMap.set(rarity.epic, 500);
rarityMap.set(rarity.legendary, 1000);

export function harvestCharacter(req, res) {
    const user = req.body.from;
    const characterId = req.body.characterId;

    Character.findById(characterId).then((character) => {
        if (character.ownerId !== req.body.from) {
            res.code(400);
            res.end('Unauthorized');
        }

        Template.findById(character.templateId).then( (template) => {
            const rarity = template.rarity();
            character.remove().then(() => {
                onStarsEarned(user.id, rarityMap.get(rarity));
            });
        });
    });
}
