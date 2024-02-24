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


import User from '../models/User.js';
import log from '../loggers.js';
import chalk from 'chalk';
import bcrypt from 'bcrypt';

export function createUser(req, res) {
    const identity = req.body?.identity;
    const password = req.body?.password;
    console.log(req);

    if (!identity || !password) {
        res.status(400);
        res.end('Password or identity missing');
        return;
    }

    User.create({
        identity,
        password,
        currentEnergy: 0,
    }).then((user) => {
        log.info('Created a user with id: ' + chalk.magenta(user._id));
        res.json({
            identity: user.identity,
            currentEnergy: user.currentEnergy,
            id: user._id,
        });
    }).catch((err) => {
        log.error(chalk.red('Problems creating a user'), err);
        res.status(503);
        res.end('Problems creating a user');
    });
}

export function loginUser(req, res) {
    const identity = req.body?.identity;
    const password = req.body?.password;

    if (!identity || !password) {
        res.status(400);
        res.end('Password or identity missing');
        return;
    }

    User.findOne({identity})
        .then((user) => {
            console.log(req.session.user);
            if (!user) {
                res.status(404);
                res.end('User not found');
                return;
            }

            bcrypt.compare(password, user.password, (error, result) => {
                if (error) {
                    log.error(chalk.red('Error comparing passwords'), error);
                    res.status(500);
                    res.end('Error comparing passwords');
                    return;
                }

                if (!result) {
                    res.status(401);
                    res.end('Invalid password');
                    return;
                }
                req.session.user = user._id;

                log.info('User logged in: ' + chalk.magenta(user._id));
                res.send('Login Success!');
            });
        })
        .catch((err) => {
            log.error(chalk.red('Invalid login'), err);
            res.status(503);
            res.end('Invalid login');
        });
}
