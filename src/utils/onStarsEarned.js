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

import report from '../report.js';
import chalk from 'chalk';
import User from '../models/User.js';

export default function (userId, amount = 1) {
    User.findById(userId).then((user) => {
        if (user.currentStars)
            user.currentStars += amount;
        else
            user.currentStars = amount;

        user.save().then(() => {
            report.info(`${chalk.cyan('Star count changed for user')} ${chalk.magenta(userId)}`);
        }).catch(() => {
            report.error(`${chalk.red('Error while saving user star count count for user')} ${chalk.magenta(userId)}`);
            throw new Error('Error while saving user star count');
        });
    }).catch(() => {
        report.error(`${chalk.red('User')} ${chalk.magenta(userId)} ${chalk.red('not found on energy star count change')}`);
        throw new Error('User not found on star count change');
    });
}
