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
import settingCache from '../cache/SettingCache.js';

export async function getCollection(req, res) {
    const user = req.body.from;
    const setting = req.query.setting || 'all';
    const sorting = req.query.sorting;
    const uniqueTemplates = new Set();

    const characters = await Character.find({ownerId: user.id})
    const responseCollection = [];
    const characterPromises = [];
    for (const character of characters) {
        const responseCharacter = character.toObject();
        responseCharacter.id = responseCharacter._id;
        delete responseCharacter._id;
        characterPromises.push(Template.findById(responseCharacter.templateId).then((template) => {
            const responseTemplate = template.toObject();
            responseTemplate.id = responseTemplate._id;
            delete responseTemplate._id;
            responseCharacter.template = responseTemplate;
            if (responseTemplate.setting === setting || setting === 'all' || typeof setting === 'undefined') {
                responseCollection.push(responseCharacter);
                uniqueTemplates.add(responseTemplate.id);
            }
        }));
    }
    await Promise.all(characterPromises);
    if (sorting === 'name') {
        responseCollection.sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        });
    } else if (sorting === 'rarity') {
        // Define the order of rarity
        const rarityOrder = {
            'legendary': 1,
            'epic': 2,
            'rare': 3,
            'uncommon': 4,
            'common': 5
        };

        responseCollection.sort((a, b) => {
            return rarityOrder[a.template.rarity] - rarityOrder[b.template.rarity];
        });
    }

    res.json({templateCount: settingCache.settingMap.get(setting || 'all'), uniqueCount: uniqueTemplates.size, responseCollection});
}
