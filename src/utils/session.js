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

export default function (req, res, next) {
    if (req.session.user) {
        User.findById(req.session.user).then((user) => {
            const trueUser = user.toObject();
            trueUser.id = trueUser._id;
            delete trueUser._id;
            delete trueUser.password;
            req.body.from = trueUser;
            next();
        }).catch((error) => {
            log.error(error);
            res.status(400).send('Invalid User Set');
        });
    } else {
        res.status(400).send('No User Set');
    }
}
