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

export function getRoll(req, res) {
    Template.find().then(( templates) => {
        const mock = templates[0].toObject();
        mock.id = mock._id;
        delete mock._id;
        res.json({
            name: mock.name,
            id: 1,
            template: mock,
        });
    });
}
