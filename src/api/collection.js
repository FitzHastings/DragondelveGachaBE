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

export function getCollection(req, res) {
    const user = req.body.from;

    Character.find({ownerId: user.id}).then((characters) => {
        const responseCollection = [];
        const characterPromises = [];
        for (const character of characters) {
            const responseCharacter = character.toObject();
            responseCharacter.id = responseCharacter._id;
            delete responseCharacter._id;
            responseCollection.push(responseCharacter);
            characterPromises.push(Template.findById(responseCharacter.templateId).then((template) => {
                const responseTemplate = template.toObject();
                responseTemplate.id = responseTemplate._id;
                delete responseTemplate._id;
                responseCharacter.template = responseTemplate;
            }));
        }
        Promise.all(characterPromises).then(() => {
            res.json(responseCollection);
        });
    });
}
