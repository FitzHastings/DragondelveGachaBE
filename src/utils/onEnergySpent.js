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

export default async function (userId, amount = 1) {
    try {
        const user = await User.findById(userId);
        if (user.currentEnergy >= amount) {
            user.currentEnergy -= amount;
            await user.save()
            report.info(`${chalk.cyan('Energy count decremented for user')} ${chalk.magenta(userId)}`);
        } else {
            report.warn(`${chalk.yellow('Not enough energy count for user')} ${chalk.magenta(userId)}`);
            throw new Error('Not enough energy count');
        }
    } catch(error) {
        report.error(`${chalk.red('User')} ${chalk.magenta(userId)} ${chalk.red('not found on energy count decrement')}`);
        throw new Error('User not found on energy decrement');
    }
}
