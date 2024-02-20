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

import Template from '../models/Template.js';
import log from '../loggers.js';
import chalk from 'chalk';
import rarity from '../utils/rarity.js';

class CharacterPool {
    constructor() {
        this.isWarm = false;
        this.templates = null;
        this.byRarity = null;
    }

    warm() {
        log.info(chalk.green('Warming Template Cache'));
        Template.find().then((docs) => {
            this.templates = new Map(docs.map((template) => [template.id, template]));
            this.byRarity = new Map();

            for (const rar in rarity)
                this.byRarity.set(rar, []);

            for (const doc of docs)
                this.byRarity.get(doc.rarity).push(doc);
            this.isWarm = true;
            log.info(
                chalk.green('Template Cache is warm with: ')
                + chalk.magenta(docs.length)
                + chalk.green(' entries')
            );
        }).catch((err) => {
            log.error(chalk.red('Failed to warm cache'), err);
        });
    }

    append(template) {
        if (this.isWarm) {
            this.templates.add(template.id, template);
            this.byRarity.add(template.rarity, template);
        }
    }

    invalidate(id) {
        if (this.isWarm) {
            this.templates.delete(id);
            this.byRarity.delete(id);
        }
    }

    flush() {
        this.templates = null;
        this.byRarity = null;
        this.isWarm = false;
    }
}

export default new CharacterPool();
