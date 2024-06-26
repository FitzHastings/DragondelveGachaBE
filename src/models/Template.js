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

import mongoose, {Schema} from 'mongoose';
import {v4 as uuidv4} from 'uuid';

const TemplateSchema = new Schema({
    _id: {
        type: String,
        default: () => uuidv4()
    },
    name: String,
    rarity: String,
    description: String,
    quote: String,
    setting: String,
    fusionCandidate: Boolean,
});

const Template = mongoose.model('template', TemplateSchema);

export default Template;
