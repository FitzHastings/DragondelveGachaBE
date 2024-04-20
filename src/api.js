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

import express from 'express';
import report from './report.js';
import {getRoll} from './api/roll.js';
import chalk from 'chalk';
import cors from 'cors';
import {createUser, loginUser, verifyUser} from './api/user.js';
import bodyParser from 'body-parser';
import expressSession from 'express-session';
import session from './utils/session.js';
import {getCollection} from './api/collection.js';
import * as process from 'process';
import expressWinston from 'express-winston';
import {harvestCharacter} from './api/harvest.js';
import {findAllAvailableFusions, performFusion} from './api/fusion.js';

export default async function setupAPI() {
    report.info(chalk.cyan('API Server starting up'));
    const app = express();
    const port = process.env.PORT;

    app.use(bodyParser.json());

    if (process.env.NODE_ENV === 'production') {
        app.use(expressSession({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            httpOnly: false,
            proxy: true,
            cookie: {
                secure: true,
                httpOnly: true,
                maxAge: 3600000
            }
        }));
    } else {
        app.use(cors({credentials: true, origin: true}));
        app.use(expressSession({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            httpOnly: false,
            cookie: {
                secure: false,
                sameSite: 'none',
                httpOnly: true,
                maxAge: 3600000
            }
        }));
    }

    app.use(express.static('public'));
    app.use(expressWinston.logger({
        winstonInstance: report,
        meta: true,
        msg: 'HTTP {{req.method}} {{req.url}} {{req.session.user}}',
        colorize: true,
        expressFormat: true,
    }));

    app.get('/collection', session, getCollection);
    app.get('/roll', session, getRoll);
    app.post('/login', loginUser);
    app.post('/user', createUser);
    app.get('/user', session, verifyUser);
    app.post('/harvest/:characterId',session, harvestCharacter);
    app.get('/fusion/', session, findAllAvailableFusions);
    app.get('/fusion/fuse/:fusionId', session, performFusion);

    await app.listen(port, () => {
        report.info(
            chalk.green('API Server is running on ')
            + chalk.magenta(port)
        );
    });
}
