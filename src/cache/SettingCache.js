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
import report from '../report.js';
import chalk from 'chalk';

const indexedSettings = [
    'TWINT',
    'Fluxmill',
    'Aether Storm',
    'Downfall',
    'Baselard'
];

class SettingCache {
    constructor() {
        this.isWarm = false;
        this.settingMap = null;
    }

    warm() {
        report.info(chalk.green('Warming Setting Cache'));
        Template.find().then((docs) => {
            this.settingMap = new Map();
            this.settingMap.set('all', 0);
            for (const setting of indexedSettings)
                this.settingMap.set(setting, 0);


            for (const doc of docs) {
                if (this.settingMap.get(doc.setting) >= 0)
                    this.settingMap.set(doc.setting, this.settingMap.get(doc.setting) + 1);
                else
                    report.warn(
                        chalk.yellow('Template ')
                        + chalk.magenta(doc.name)
                        + chalk.yellow(' is from a non indexed setting: ')
                        + chalk.magenta(`"${doc.setting}"`)
                    );

                this.settingMap.set('all', this.settingMap.get('all') + 1);
            }
            this.isWarm = true;

            report.info(
                chalk.green('Setting cache is warm with: ')
                + chalk.magenta(this.settingMap.size)
                + chalk.green(' entries.')
            );
        }).catch((err) => {
            report.error(chalk.red('Failed to warm cache'), err);
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

export default new SettingCache();
