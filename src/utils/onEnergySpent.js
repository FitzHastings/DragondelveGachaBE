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

import log from '../loggers.js';
import chalk from 'chalk';
import User from '../models/User.js';

export default function (userId, amount = 1) {
    User.findById(userId).then((user) => {
        if (user.currentEnergy >= amount) {
            user.currentEnergy -= amount;
            user.save().then(() => {
                log.info(`Energy count decremented for user ${chalk.magenta(userId)}`);
            }).catch(() => {
                log.error(`${chalk.red('Error while saving user energy count for user')} ${chalk.magenta(userId)}`);
                throw new Error('Error while saving user energy count');
            });
        } else {
            log.warn(`${chalk.yellow('Not enough energy count for user')} ${chalk.magenta(userId)}`);
            throw new Error('Not enough energy count');
        }
    }).catch(() => {
        log.error(`${chalk.red('User')} ${chalk.magenta(userId)} ${chalk.red('not found on energy count decrement')}`);
        throw new Error('User not found on energy decrement');
    });
}
